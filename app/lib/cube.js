import * as _ from 'lodash';
import { rotate } from './utils';
import Moves from './moves';

export default class Cube {
  constructor() {
    this.sides = {
      'U': ['U', 'UBR', 'UR', 'URF', 'UF', 'UFL', 'UL', 'ULB', 'UB'],
      'F': ['F', 'FUR', 'FR', 'FRD', 'FD', 'FDL', 'FL', 'FLU', 'FU'],
      'D': ['D', 'DFR', 'DR', 'DRB', 'DB', 'DBL', 'DL', 'DLF', 'DF'],
      'B': ['B', 'BUL', 'BL', 'BLD', 'BD', 'BDR', 'BR', 'BRU', 'BU'],
      'R': ['R', 'RUB', 'RB', 'RBD', 'RD', 'RDF', 'RF', 'RFU', 'RU'],
      'L': ['L', 'LUF', 'LF', 'LFD', 'LD', 'LDB', 'LB', 'LBU', 'LU']
    };
    this.lines = {
      'R': [['UBR', 'UR', 'URF'], ['BDR', 'BR', 'BRU'], ['DFR', 'DR', 'DRB'], ['FUR', 'FR', 'FRD']],
      'L': [['FLU', 'FL', 'FDL'], ['DLF', 'DL', 'DBL'], ['BLD', 'BL', 'BUL'], ['ULB', 'UL', 'UFL']],
      'U': [['FLU', 'FU', 'FUR'], ['LBU', 'LU', 'LUF'], ['BRU', 'BU', 'BUL'], ['RFU', 'RU', 'RUB']],
      'D': [['FDL', 'FD', 'FRD'], ['RDF', 'RD', 'RBD'], ['BDR', 'BD', 'BLD'], ['LDB', 'LD', 'LFD']],
      'F': [['UFL', 'UF', 'URF'], ['RFU', 'RF', 'RDF'], ['DFR', 'DF', 'DLF'], ['LFD', 'LF', 'LUF']],
      'B': [['UBR', 'UB', 'ULB'], ['LBU', 'LB', 'LDB'], ['DBL', 'DB', 'DRB'], ['RBD', 'RB', 'RUB']],
      'M': [['FU', 'F', 'FD'], ['DF', 'D', 'DB'], ['BD', 'B', 'BU'], ['UB', 'U', 'UF']],
      'S': [['UL', 'U', 'UR'], ['RU', 'R', 'RD'], ['DR', 'D', 'DL'] ,['LD', 'L', 'LU']],
      'E': [['FL', 'F', 'FR'], ['RF', 'R', 'RB'], ['BR', 'B', 'BL'], ['LB', 'L', 'LF']]
    };

    this.stickers = {};
    this.moves = {};

    let moveFaceFn = (side, amount) => (() => (this.linearMove(side, amount), this.rotateSide(side, amount)));
    ['R', 'L', 'U', 'D', 'F', 'B'].forEach(side => {
      this.moves[side] = moveFaceFn(side, 1);
      this.moves[`${side}'`] = moveFaceFn(side, -1);
      this.moves[`${side}2`] = moveFaceFn(side, 2);
    });

    ['M', 'S', 'E'].forEach(side => {
      this.moves[side] = () => this.linearMove(side);
      this.moves[`${side}'`] = () => this.linearMove(side, -1);
      this.moves[`${side}2`] = () => this.linearMove(side, 2);
    });

    let doMovesFn = (...moves) => (() => moves.forEach(move => this.moves[move]()));

    [['r', "M'"], ['l', 'M'], ['u', "E'"], ['d', 'E'], ['f', 'S'], ['b', "S'"]]
      .forEach(([doubleLayerMove, correspondingSliceMove]) => {
        let singleLayerMove = doubleLayerMove.toUpperCase();
        let oppositeSliceMove = Moves.moveInversion(correspondingSliceMove);
        let doubleSliceMove = `${correspondingSliceMove[0]}2`;
        this.moves[doubleLayerMove] = this.moves[`${singleLayerMove}w`] = doMovesFn(singleLayerMove, correspondingSliceMove);
        this.moves[`${doubleLayerMove}'`] = this.moves[`${singleLayerMove}w'`] = doMovesFn(`${singleLayerMove}'`, oppositeSliceMove);
        this.moves[`${doubleLayerMove}2`] = this.moves[`${singleLayerMove}w2`] = doMovesFn(`${singleLayerMove}2`, doubleSliceMove);
      });

    [['y', 'u', "D"], ['z', 'f', "B"], ['x', 'r', "L"]]
      .forEach(([rotation, clockwiseMove, counterClockwiseMove]) => {
        this.moves[rotation] = doMovesFn(clockwiseMove, `${counterClockwiseMove}'`);
        this.moves[`${rotation}'`] = doMovesFn(`${clockwiseMove}'`, counterClockwiseMove);
        this.moves[`${rotation}2`] = doMovesFn(`${clockwiseMove}2`, `${counterClockwiseMove}2`);
      });

    /* Define 2' move endings as aliases for 2. */
    Object.keys(this.moves).filter(move => move.endsWith('2')).forEach(move => this.moves[`${move}'`] = this.moves[move]);

    this.reset();
  }

  reset() {
    _.each(this.sides, (sideStickers, side) => {
      _.each(sideStickers, sticker => this.stickers[sticker] = side);
    });
  }

  linearMove(lineId, amount = 1) {
    let line = this.lines[lineId];
    let values = _.flatten(line).map(sticker => this.stickers[sticker]);
    let rotatedLine = rotate(line, amount);
    _.flatten(rotatedLine).forEach((sticker, index) => this.stickers[sticker] = values[index]);
  }

  rotateSide(side, amount = 1) {
    let offset = amount * 2;
    let stickers = this.sides[side].slice(1); /* Ignore centers. */
    let values = stickers.map(sticker => this.stickers[sticker]);
    let rotatedStickers = rotate(stickers, offset);
    rotatedStickers.forEach((sticker, index) => this.stickers[sticker] = values[index]);
  }

  applyMoves(moves) {
    Moves.stringToMoves(moves).forEach(move => this.moves[move]());
  }

  isSolved() {
    return _.every(this.stickers, (value, sticker) => this.isStickerSolved(sticker));
  }

  stickerType(sticker) {
    switch(sticker.length) {
      case 1: return 'center';
      case 2: return 'edge';
      case 3: return 'corner';
    }
  }

  stickerSide(sticker) {
    return sticker[0];
  }

  isCenterSticker(sticker) {
    return this.stickerType(sticker) === 'center';
  }

  isEdgeSticker(sticker) {
    return this.stickerType(sticker) === 'edge';
  }

  isCornerSticker(sticker) {
    return this.stickerType(sticker) === 'corner';
  }

  isStickerSolved(sticker) {
    /* A sticker is considered to be solved when it has the same value as a center on the side. */
    return this.stickers[sticker] === this.stickers[this.stickerSide(sticker)];
  }

  isElementSolved(element) {
    /* Element is considered solved when all its stickers are solved.
       E.g. URF corner is solved when URF, RFU and FUR stickers are solved.
            UF edge is solved when UF and FU stickers are solved. */
    return this.elementStickers(element).every(sticker => this.isStickerSolved(sticker));
  }

  elementStickers(element) {
    return _.range(element.length).map(i => rotate(element, i));
  }
}
