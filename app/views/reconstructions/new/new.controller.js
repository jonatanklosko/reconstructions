import Moves from '../../../lib/moves';
import CfopAnalyzer from '../../../lib/cfop-analyzer';

export default class ReconstructionsNewController {
  constructor($stateParams, $scope) {
    'ngInject';

    let { scramble = '', solution = '', time = '' } = $stateParams;
    Object.assign(this, { scramble, solution, time });
    this.activeSupport = true;
    $scope.$watch('[vm.scramble, vm.solution, vm.activeSupport]', ([scramble, solution, activeSupport]) => {
      let { steps, isSolved } = CfopAnalyzer.analyzeSolution(scramble, solution);
      if(activeSupport) {
        this.scramble = Moves.stringToMoves(scramble).join(' ');
        this.solution = steps.map(step => step.moves.join(' ')).join('\n');
      }
      this.isSolved = isSolved;
    });
  }


  showParams() {
    return {
      scramble: Moves.shrink(this.scramble),
      solution: Moves.shrink(this.solution),
      time: this.time
    };
  }
}
