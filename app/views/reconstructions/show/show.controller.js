import * as _ from 'lodash';

export default class ReconstructionsShowController {
  constructor($stateParams, CfopAnalyzer, MovesService, $httpParamSerializer, clipboard, $location, $http, URLSHORTENER_URL) {
    'ngInject';

    this.clipboard = clipboard;
    this.$location = $location;
    this.$stateParams = $stateParams;

    let currentUrl = $location.absUrl();
    this.shortUrl = currentUrl; /* Assign the full url temporarily, before the short one is fetched or in case something goes wrong. */
    $http.post(URLSHORTENER_URL, { longUrl: currentUrl })
      .then(response => this.shortUrl = response.data.id);

    let { scramble, solution, time } = $stateParams;
    let { steps, totalMoveCount } = CfopAnalyzer.analyzeSolution(scramble, solution);
    this.steps = steps;
    this.totalMoveCount = totalMoveCount;

    this.scramble = MovesService.stringToMoves(scramble).join(' ');
    this.solution = MovesService.stringToMoves(solution).join(' ');
    this.time = _.toNumber(time);

    this.formatedSolution = this.steps.map(step => {
      return `${step.moves.join(' ')} // ${step.name}`;
    }).join('\n');

    let animationParams = {
      setup: scramble,
      alg: this.formatedSolution,
      title: 'Reconstruction',
      type: 'reconstruction'
    };
    this.animationUrl = `https://alg.cubing.net/?${$httpParamSerializer(animationParams)}`;

    this.metrics = Object.keys(MovesService.metrics);
  }

  copyUrl() {
    this.clipboard.copyText(this.shortUrl);
  }

  copySolution() {
    let text = `Scramble: ${this.scramble}\n\n${this.formatedSolution}`;
    if(this.time) {
      text = `Time: ${this.time}\n${text}`;
    }
    this.clipboard.copyText(text);
  }

  calculateTps(moveCount, time) {
    return _.round(moveCount / time, 2);
  }
}
