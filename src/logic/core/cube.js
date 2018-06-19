import { doubleMove, invertMove } from './moves';
import { flatMap, fromPairs, rotate, zip } from './utils';

export const SIDES = {
  'U': ['U', 'UBR', 'UR', 'URF', 'UF', 'UFL', 'UL', 'ULB', 'UB'],
  'F': ['F', 'FUR', 'FR', 'FRD', 'FD', 'FDL', 'FL', 'FLU', 'FU'],
  'D': ['D', 'DFR', 'DR', 'DRB', 'DB', 'DBL', 'DL', 'DLF', 'DF'],
  'B': ['B', 'BUL', 'BL', 'BLD', 'BD', 'BDR', 'BR', 'BRU', 'BU'],
  'R': ['R', 'RUB', 'RB', 'RBD', 'RD', 'RDF', 'RF', 'RFU', 'RU'],
  'L': ['L', 'LUF', 'LF', 'LFD', 'LD', 'LDB', 'LB', 'LBU', 'LU']
};

export const LINES = {
  'R': ['URF', 'UR', 'UBR', 'BRU', 'BR', 'BDR', 'DRB', 'DR', 'DFR', 'FRD', 'FR', 'FUR'],
  'L': ['ULB', 'UL', 'UFL', 'FLU', 'FL', 'FDL', 'DLF', 'DL', 'DBL', 'BLD', 'BL', 'BUL'],
  'U': ['FUR', 'FU', 'FLU', 'LUF', 'LU', 'LBU', 'BUL', 'BU', 'BRU', 'RUB', 'RU', 'RFU'],
  'D': ['FDL', 'FD', 'FRD', 'RDF', 'RD', 'RBD', 'BDR', 'BD', 'BLD', 'LDB', 'LD', 'LFD'],
  'F': ['UFL', 'UF', 'URF', 'RFU', 'RF', 'RDF', 'DFR', 'DF', 'DLF', 'LFD', 'LF', 'LUF'],
  'B': ['UBR', 'UB', 'ULB', 'LBU', 'LB', 'LDB', 'DBL', 'DB', 'DRB', 'RBD', 'RB', 'RUB'],
  'M': ['UB', 'U', 'UF', 'FU', 'F', 'FD', 'DF', 'D', 'DB', 'BD', 'B', 'BU'],
  'S': ['UL', 'U', 'UR', 'RU', 'R', 'RD', 'DR', 'D', 'DL', 'LD', 'L', 'LU'],
  'E': ['FL', 'F', 'FR', 'RF', 'R', 'RB', 'BR', 'B', 'BL', 'LB', 'L', 'LF']
};

const PARTIAL_MOVES = {
  'r': ['R', "M'"],
  'l': ['L', 'M'],
  'u': ['U', "E'"],
  'd': ['D', 'E'],
  'f': ['F', 'S'],
  'b': ['B', "S'"],
  'y': ['u', "D'"],
  'z': ['f', "B'"],
  'x': ['r', "L'"],
  'Rw': ['r'], 'Lw': ['l'], 'Uw': ['u'], 'Dw': ['d'], 'Fw': ['f'], 'Bw': ['b']
};

export const newCube = () =>
  fromPairs(flatMap(Object.entries(SIDES), ([side, stickers]) =>
    stickers.map(sticker => [sticker, side])
  ));

const rotateStickers = (cube, stickers, offset) => {
  const values = stickers.map(sticker => cube[sticker]);
  const rotatedValues = rotate(values, -offset); /* Rotate clockwise for positive offsets. */
  return { ...cube, ...fromPairs(zip(stickers, rotatedValues)) };
};

export const rotateLine = (cube, line, amount) =>
  rotateStickers(cube, LINES[line], amount * 3);

export const rotateSide = (cube, side, amount) =>
  rotateStickers(cube, SIDES[side].slice(1), amount * 2);

export const applyMove = (cube, move) => {
  const [, baseMove, double, anticlockwise] = move.match(/^(.+?)(2?)('?)$/);
  const amount = double ? 2 : (anticlockwise ? -1 : 1);
  if (baseMove.match(/^[RLUDFB]$/)) {
    return rotateSide(rotateLine(cube, baseMove, amount), baseMove, amount);
  } else if (baseMove.match(/^[MSE]$/)) {
    return rotateLine(cube, baseMove, amount);
  } else if (PARTIAL_MOVES[baseMove]) {
    return applyMoves(cube, PARTIAL_MOVES[baseMove].map(partialMove =>
      double ? doubleMove(partialMove) : (anticlockwise ? invertMove(partialMove) : partialMove)
    ));
  } else {
    throw new Error(`Incorrect move: ${move}`);
  }
};

export const applyMoves = (cube, moves) =>
  moves.reduce((cube, move) => applyMove(cube, move), cube);
