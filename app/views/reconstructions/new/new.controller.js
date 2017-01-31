export default class ReconstructionsNewController {
  constructor($stateParams, $scope, MovesService, CfopAnalyzer) {
    'ngInject';

    this.MovesService = MovesService;

    let { scramble = '', solution = '', time = '' } = $stateParams;
    Object.assign(this, { scramble, solution, time });
    this.activeSupport = true;
    $scope.$watch('[vm.scramble, vm.solution, vm.activeSupport]', ([scramble, solution, activeSupport]) => {
      let { steps, isSolved } = CfopAnalyzer.analyzeSolution(scramble, solution);
      if(activeSupport) {
        this.scramble = MovesService.stringToMoves(scramble).join(' ');
        this.solution = steps.map(step => step.moves.join(' ')).join('\n');
      }
      this.isSolved = isSolved;
    });
  }


  showParams() {
    return {
      scramble: this.MovesService.shrink(this.scramble),
      solution: this.MovesService.shrink(this.solution),
      time: this.time
    };
  }
}
