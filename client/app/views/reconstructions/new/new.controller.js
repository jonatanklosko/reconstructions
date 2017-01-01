export default class ReconstructionsNewController {
  constructor($scope, MovesService, CfopAnalyzer) {
    'ngInject';

    this.scramble = this.solution = '';
    this.activeSupport = true;
    $scope.$watch('[vm.scramble, vm.solution, vm.activeSupport]', ([scramble, solution, activeSupport]) => {
      let { steps, isSolved } = CfopAnalyzer.analyzeSolution(scramble, solution);
      if(activeSupport) {
        this.scramble = MovesService.stringToMoves(scramble).join(' ');
        this.solution = steps.map(step => step.moves.join(' ')).join('\n');
      }
      this.showParams = {
        scramble: MovesService.shrink(scramble),
        solution: MovesService.shrink(solution)
      };
      this.isSolved = isSolved;
    });
  }
}
