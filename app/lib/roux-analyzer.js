import SolutionAnalyzer from './solution-analyzer';
import * as _ from 'lodash';

export default class RouxAnalyzer extends SolutionAnalyzer {
  solvedSquares() {
    let squaresPerSide = _.mapValues(this.cube.sides, (stickers, side) => {
      let solvedCorners = stickers.filter(sticker => this.cube.isCornerSticker(sticker) && this.cube.isStickerSolved(sticker));
      return solvedCorners.filter(corner => {
        let adjacentSides = _.without(corner.split(''), side);
        let edges = adjacentSides.map(adjacentSide => `${side}${adjacentSide}`);

        return _.chain([...edges, side, corner])
          .flatMap(element => this.cube.elementStickers(element))
          .groupBy(sticker => this.cube.stickerSide(sticker))
          .every(stickers => this.haveSameValue(stickers))
          .value();
      });
    });

    return _.omitBy(squaresPerSide, _.isEmpty);
  }

  eo() {
    return this.allEdgesOriented();
  }

  ulur() {
    let lrValues = ['L', 'R'].map(center => this.cube.stickers[center]);
    return _.chain(this.cube.sides['U'])
      .flatMap(element => this.cube.elementStickers(element))
      .groupBy(sticker => this.cube.stickerSide(sticker))
      .omit('U')
      .map(stickers => stickers.map(sticker => this.cube.stickers[sticker])) /* Values per side. */
      .map(_.uniq)
      .filter(uniqeValuesOnSide => uniqeValuesOnSide.length === 1)
      .flatten()
      .thru(beltValues => _.isEqual(_.intersection(lrValues, beltValues), lrValues)) /* Belts corresponding to the left and the right side are solved. */
      .value();
  }

  /**
   * Returns one of the following numbers:
   *  0 - Nothing is done
   *  1 - First square is solved
   *  2 - First block is solved
   *  3 - Second square is solved
   *  4 - Second block is solved
   *  5 - Top layer corners are solved relatively to each other.
   *  6 - All edges are oriented
   *  7 - UL/UR edges solved relatively to the corresponding corners
   *  8 - The cube is solved
   *
   * Note: when a step is done then all previous ones are done as well.
   */
  currentStepNumber() {
    let squares = this.solvedSquares();
    if(_.isEmpty(squares)) return 0;
    let blocks = _.pickBy(squares, corners => corners.length >= 2);
    if(_.isEmpty(blocks)) return 1;
    if(!_.some(blocks, (corners, side) => squares[this.opposite[side]])) return 2;
    let f2bDone = _.every(_.pick(squares, ['L', 'R']), corners => {
      return corners.filter(corner => corner.includes('D')).length >= 2;
    });
    if(!f2bDone) return 3;
    if(!this.elementsSolved('U', sticker => this.cube.isCornerSticker(sticker))) return 4;
    if(!this.eo()) return 5;
    if(!this.ulur()) return 6;
    if(!this.cube.isSolved()) return 7;
    return 8;
  }

  getStepName(stepNumberBefore, stepNumber) {
    if(stepNumber === 1)  return 'First Square';
    if(stepNumber === 2)  return 'First Block';
    if(stepNumber === 3)  return 'Second Square';
    if(stepNumberBefore < 4 && stepNumber >= 4)  return 'Second Block';
    if(stepNumberBefore === 4) return 'CMLL';
    if(stepNumberBefore === 5 && stepNumber === 6) return 'EO';
    if(stepNumberBefore === 5 && stepNumber === 7) return 'EO + UL/UR';
    if(stepNumberBefore === 5 && stepNumber === 8) return 'LSE';
    if(stepNumberBefore === 6 && stepNumber === 7) return 'UL/UR';
    if(stepNumberBefore === 6 && stepNumber === 8) return 'EP';
    if(stepNumberBefore === 7 && stepNumber === 8) return 'EP';
  }
}
