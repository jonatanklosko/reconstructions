import * as _ from 'lodash';
import Moves from './moves';
import Cube from './cube';
import { reverse } from './utils';

export default class SolutionAnalyzer {
  constructor() {
    this.cube = new Cube();
    /* Maps to an apposite side. Could also be treated as mapping with an opposite value. */
    this.opposite = { 'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'B', 'B': 'F' };
  }

  analyzeSolution(scramble, solution) {
    this.cube.reset();
    this.cube.applyMoves(scramble);

    let stepNumber = this.currentStepNumber();
    let steps = [];
    let currentStep = [];
    let moves = Moves.stringToMoves(solution);

    /* Handle ritations at the beginning - inspection. */
    let firstNonRotation = moves.findIndex(move => !Moves.movesByType['ritation'].includes(move));
    if(firstNonRotation === -1) firstNonRotation = moves.length;
    let [inspection, solve] = [moves.slice(0, firstNonRotation), moves.slice(firstNonRotation)];
    if(inspection.length) {
      this.cube.applyMoves(inspection.join(' '));
      steps.push({ moves: inspection, name: 'inspection' });
    }

    solve.forEach(move => {
      this.cube.applyMoves(move);
      currentStep.push(move);
      let stepNumberAfterMove = this.currentStepNumber();
      if(stepNumberAfterMove > stepNumber) {
        steps.push({
          moves: currentStep,
          name: this.getStepName(stepNumber, stepNumberAfterMove)
        });
        stepNumber = stepNumberAfterMove;
        currentStep = [];
      }
    });

    /* Solution can left the cube unsolved. Include the rest of the moves in the result as well. */
    if(currentStep.length) {
      steps.push({ moves: currentStep, name: 'the rest' });
    }

    steps.forEach(step => step.moveCount = Moves.countMoves(step.moves));

    return {
      steps,
      isSolved: this.cube.isSolved(),
      totalMoveCount: Moves.countMoves(solve) /* Don't count rotations done during an inspection. */
    };
  }

  allEdgesOriented() {
    // See: https://www.speedsolving.com/wiki/index.php/EOLine#EO_Detection
    let stickers = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BR', 'BL'];
    let value = sticker => this.cube.stickers[sticker];
    let hasSameValueAs = (stickers, sticker) => stickers.map(value).includes(value(sticker));
    let anyMisoriented = stickers.some(sticker => {
      return hasSameValueAs(['L', 'R'], sticker) || (hasSameValueAs(['F', 'B'], sticker) && hasSameValueAs(['D', 'U'], reverse(sticker)));
    });
    return !anyMisoriented;
  }

  haveSameValue(stickers) {
    return _.uniq(stickers.map(sticker => this.cube.stickers[sticker])).length === 1;
  }

  elementsSolved(side, stickerPredicate = () => true) {
    return _.chain(this.cube.sides[side])
      .filter(stickerPredicate)
      .flatMap(corner => this.cube.elementStickers(corner))
      .groupBy(sticker => this.cube.stickerSide(sticker))
      .every(stickersOnSide => this.haveSameValue(stickersOnSide))
      .value();
  }
}
