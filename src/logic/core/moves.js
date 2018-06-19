const METRICS = {
  stm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [1, 1], rotation: [0, 0] },
  etm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [1, 1], rotation: [1, 1] },
  htm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [2, 2], rotation: [0, 0] },
  qtm: { singleLayer: [1, 2], doubleLayer: [1, 2], slice: [2, 4], rotation: [0, 0] }
};

const PATTERN_BY_MOVE_TYPE = {
  singleLayer: /^[RLUDFB]2?'?$/,
  doubleLayer: /^([rludfb]|[RLUDFB]w)2?'?$/,
  slice: /^[MSE]2?'?$/,
  rotation: /^[xyz]2?'?$/
};

const MOVES_REGEXP = /([RLUDFB]w?|[rludfbMSExyz])2?'?/g;

export const stringToMoves = string =>
  string.match(MOVES_REGEXP) || [];

export const invertMove = move =>
  move.match(/(2|')$/) ? move.replace("'", '') : move + "'";

export const doubleMove = move =>
  move.replace(/2?'?$/, '2');

export const inversion = string =>
  stringToMoves(string).map(invertMove).reverse().join(' ');

export const shrink = string =>
  stringToMoves(string).join('');

export const prettify = string =>
  stringToMoves(string).join(' ');

export const countMoves = moves =>
  Object.entries(METRICS).reduce((countByMetric, [metric, metricData]) => ({
    ...countByMetric,
    [metric]: Object.entries(metricData).reduce((count, [moveType, [singleMoveValue, doubleMoveValue]]) =>
      moves
        .filter(move => move.match(PATTERN_BY_MOVE_TYPE[moveType]))
        .reduce((count, move) => count + (move.match(/2'?$/) ? doubleMoveValue : singleMoveValue), count)
    , 0)
  }), {});
