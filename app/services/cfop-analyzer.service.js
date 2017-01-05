import * as _ from 'lodash';

export default class CfopAnalyzer {
  constructor(MovesService, CubeService) {
    'ngInject';

    this.MovesService = MovesService;

    this.cube = new CubeService.Cube();
  }

  analyzeSolution(scramble, solution) {
    this.cube.reset();
    this.cube.applyMoves(scramble);

    /* After F2L is done, save the value of the cross center to determine the corresponding LL side dynamically.
       Note: it's necessary to find the LL center dynamically rather than saving it because of rotations which change it. */
    let savedLlCenterValue = null;
    let getSavedLlSide = () => {
      if(!savedLlCenterValue) {
        let currentLlSide = this.getLlSide();
        if(currentLlSide) {
          savedLlCenterValue = this.cube.stickers[currentLlSide];
        }
      }
      if(savedLlCenterValue) {
        return Object.keys(this.cube.stickers).find(sticker => {
          return this.cube.isCenterSticker(sticker) && this.cube.stickers[sticker] === savedLlCenterValue;
        });
      }
    };

    let stepNumber = this.currentStepNumber(getSavedLlSide());
    let steps = [];
    let currentStep = [];
    let moves = this.MovesService.stringToMoves(solution);

    /* Handle ritations at the beginning - inspection. */
    let firstNonRotation = moves.findIndex(move => !this.MovesService.movesByType['ritation'].includes(move));
    if(firstNonRotation === -1) firstNonRotation = moves.length;
    let [inspection, furtherMoves] = [moves.slice(0, firstNonRotation), moves.slice(firstNonRotation)];
    if(inspection.length) {
      this.cube.applyMoves(inspection.join(' '));
      steps.push({ moves: inspection, name: 'inspection' });
    }

    furtherMoves.forEach(move => {
      this.cube.applyMoves(move);
      currentStep.push(move);
      let stepNumberAfterMove = this.currentStepNumber(getSavedLlSide());
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

    steps.forEach(step => step.movesCount = this.MovesService.countMoves(step.moves));

    return {
      steps,
      isSolved: this.cube.isSolved(),
      totalMoveCount: this.MovesService.countMoves(moves)
    };
  }

  sidesWithCrossSolved() {
    return Object.keys(this.cube.sides).filter(side => {
      let edgeStickersAroundCenter = Object.keys(this.cube.stickers).filter(sticker => {
        return sticker.startsWith(side) && this.cube.isEdgeSticker(sticker);
      });
      return edgeStickersAroundCenter.every(sticker => this.cube.isElementSolved(sticker));
    });
  }

  solvedSlots() {
    let solvedSlotsPerCross = this.sidesWithCrossSolved().map(side => {
      let solvedSlotsAroundCross = Object.keys(this.cube.stickers).filter(sticker => {
        return sticker.startsWith(side)
            && this.cube.isCornerSticker(sticker)
            && this.cube.isElementSolved(sticker) /* Corner of the slot */
            && this.cube.isElementSolved(sticker.slice(1)); /* Corresponding edge of the slot */
      });
      return {
        side: side,
        count: solvedSlotsAroundCross.length
      };
    });
    return _.maxBy(solvedSlotsPerCross, 'count') || { count: 0 };
  }

  getLlSide() {
    let { side, count } = this.solvedSlots();
    let oppositeSide = { 'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'B', 'B': 'F' }[side];
    /* When F2L is solved on a side, then assume that the LL side is the opposite one. */
    return count === 4 ? oppositeSide : null;
  }

  checkElementsOnSide(side, elementsType, state) {
    let stickers = Object.keys(this.cube.stickers)
      .filter(sticker => sticker.startsWith(side) && _.trim(elementsType, 's') === this.cube.stickerType(sticker));

    if(state === 'oriented') {
      return stickers.every(sticker => this.cube.isStickerSolved(sticker));
    } else if(state === 'permuted') {
      /* Check if elements are permuted relatively to each other. */
      /* Rotate the side 4 times and after each check if elements are permuted. */
      return _.range(4).reduce(arePermuted => {
        this.cube.applyMoves(side);
        return arePermuted || stickers.every(sticker => this.cube.isElementPermuted(sticker));
      }, false);
    } else {
      throw `Unrecognized state: '${state}'`;
    }
  }

  areLlEdgesOrignted(llSide) {
    return this.checkElementsOnSide(llSide, 'edges', 'oriented');
  }

  areLlCornersOrignted(llSide) {
    return this.checkElementsOnSide(llSide, 'corners', 'oriented');
  }

  areLlCornersPermuted(llSide) {
    return this.checkElementsOnSide(llSide, 'corners', 'permuted');
  }

  areLlElementsRelativelySolved(llSide) {
    return _.range(4).reduce(isSolved => {
      this.cube.applyMoves(llSide);
      return isSolved || this.cube.isSolved();
    }, false);
  }

  /**
   * Returns one of the following numbers:
   *  0 - Nothing is done
   *  1 - Cross is solved
   *  2 - 1st Pair is solved
   *  3 - 2nd Pair is solved
   *  4 - 3rd Pair is solved
   *  5 - 4th Pair is solved
   *  6 - LL Edges are oriented
   *  7 - LL Corners are oriented
   *  8 - LL Corners are permuted
   *  9 - LL is permuted
   *  10 - The cube is solved
   *
   * Note: when a step is done then all previous ones are done as well.
   */
  currentStepNumber(llSide) {
    if(this.sidesWithCrossSolved().length === 0) return 0;
    let { count: slotsCount } = this.solvedSlots();
    if(slotsCount < 4) return 1 + slotsCount;
    if(!this.areLlEdgesOrignted(llSide)) return 5;
    if(!this.areLlCornersOrignted(llSide)) return 6;
    if(!this.areLlCornersPermuted(llSide)) return 7;
    if(!this.areLlElementsRelativelySolved(llSide)) return 8;
    if(!this.cube.isSolved()) return 9;
    return 10;
  }

  getStepName(stepNumberBefore, stepNumber) {
    if(stepNumberBefore === 0 && stepNumber <= 5) {
      return `${'x'.repeat(stepNumber - 1)}cross`;
    }

    if(stepNumberBefore === 4 && stepNumber === 7)  return 'OLS';
    if(stepNumberBefore === 5 && stepNumber === 6)  return 'EOLL';
    if(stepNumberBefore === 5 && stepNumber === 7)  return 'OLL';
    if(stepNumberBefore === 5 && stepNumber === 8)  return 'OLLCP';
    if(stepNumberBefore === 5 && stepNumber >= 9)   return '1LLL';
    if(stepNumberBefore === 6 && stepNumber === 7)  return 'OCLL';
    if(stepNumberBefore === 6 && stepNumber === 8)  return 'COLL';
    if(stepNumberBefore === 6 && stepNumber >= 9)   return 'ZBLL';
    if(stepNumberBefore === 7 && stepNumber == 8)   return 'CPLL';
    if(stepNumberBefore === 7 && stepNumber >= 9)   return 'PLL';
    if(stepNumberBefore === 8 && stepNumber >= 9)   return 'EPLL';
    if(stepNumberBefore === 9 && stepNumber == 10)  return 'AUF';

    if(0 < stepNumberBefore && stepNumber <= 7) {
      let pairs = ['1st', '2nd', '3rd', '4th'];
      let name = `${pairs.slice(stepNumberBefore - 1, stepNumber - 1).join(' + ')} pair`;
      if(stepNumber === 6) name += " / EOLS";
      if(stepNumber >= 7) name += " / OLS";
      return name;
    }
  }
}
