import SolutionAnalyzer from './solution-analyzer';
import * as _ from 'lodash';

export default class CfopAnalyzer extends SolutionAnalyzer {
  sidesWithCrossSolved() {
    return _.keys(_.pickBy(this.cube.sides, stickers => {
      return stickers.filter(sticker => this.cube.isEdgeSticker(sticker))
                     .every(sticker => this.cube.isElementSolved(sticker));
    }));
  }

  solvedSlots() {
    let solvedSlotsPerCross = this.sidesWithCrossSolved().map(side => {
      let solvedSlotsAroundCross = this.cube.sides[side].filter(sticker => {
        return this.cube.isCornerSticker(sticker)
            && this.cube.isElementSolved(sticker) /* Corner of the slot */
            && this.cube.isElementSolved(sticker.slice(1)); /* Corresponding edge of the slot */
      });
      return { side, count: solvedSlotsAroundCross.length };
    });
    return _.maxBy(solvedSlotsPerCross, 'count') || { side: null, count: 0 };
  }

  areLlEdgesOriented(llSide) {
    return this.haveSameValue(this.cube.sides[llSide].filter(sticker => this.cube.isEdgeSticker(sticker)));
  }

  areLlCornersOriented(llSide) {
    return this.haveSameValue(this.cube.sides[llSide].filter(sticker => this.cube.isCornerSticker(sticker)));
  }

  areLlCornersPermuted(llSide) {
    return this.elementsSolved(llSide, sticker => this.cube.isCornerSticker(sticker));
  }

  areLlElementsRelativelySolved(llSide) {
    return this.elementsSolved(llSide);
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
  currentStepNumber() {
    if(this.sidesWithCrossSolved().length === 0) return 0;
    let { count: slotsCount, side } = this.solvedSlots();
    if(slotsCount < 4) return 1 + slotsCount;

    /* After F2L is done, save the value of the cross center to determine the corresponding LL side dynamically.
       Note: it's necessary to find the LL center dynamically rather than saving it because of possible rotations which change it. */
    let currentLlSide = this.opposite[side];
    this.savedLlCenterValue = this.savedLlCenterValue || this.cube.stickers[currentLlSide];
    let llSide = _.keys(this.cube.stickers)
      .filter(sticker => this.cube.isCenterSticker(sticker))
      .find(sticker => this.cube.stickers[sticker] === this.savedLlCenterValue);

    if(!this.areLlEdgesOriented(llSide)) return 5;
    if(!this.areLlCornersOriented(llSide)) return 6;
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

    if(0 < stepNumberBefore && stepNumberBefore <= 4) {
      let pairs = ['1st', '2nd', '3rd', '4th'];
      let name = `${pairs.slice(stepNumberBefore - 1, stepNumber - 1).join(' + ')} pair`;
      if(stepNumber === 6) name += " / EOLS";
      if(stepNumber >= 7) name += " / OLS";
      return name;
    }
  }
}
