import Moves from '../../../lib/moves';
import methods from '../../../lib/methods';

export default class ReconstructionsNewController {
  constructor($stateParams, $scope) {
    'ngInject';

    this.methods = methods;

    let { scramble = '', solution = '', time = '', method = 'cfop' } = $stateParams;
    Object.assign(this, { scramble, solution, time, method });
    this.activeSupport = true;
    $scope.$watch('[vm.scramble, vm.solution, vm.activeSupport, vm.method]', ([scramble, solution, activeSupport, method]) => {
      let { steps, isSolved } = methods[method].analyzer.analyzeSolution(scramble, solution);
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
      time: this.time,
      method: this.method
    };
  }
}
