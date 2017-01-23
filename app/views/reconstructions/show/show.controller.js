import * as _ from 'lodash';

export default class ReconstructionsShowController {
  constructor($stateParams, CfopAnalyzer, MovesService, $httpParamSerializer, clipboard, $location) {
    'ngInject';

    this.clipboard = clipboard;
    this.$location = $location;

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
    let url = this.$location.absUrl();
    this.clipboard.copyText(url);
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
