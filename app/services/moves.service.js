import * as _ from 'lodash';

export default class MovesService {
  constructor() {
    let expand = moves => _.flatten(moves.map(move => [move, `${move}'`, `${move}2`, `${move}2'`]));
    this.movesByType = {
      singleLayer: expand(['R', 'L', 'U', 'D', 'F', 'B']),
      doubleLayer: expand(['r', 'l', 'u', 'd', 'f', 'b', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw']),
      slice: expand(['M', 'S', 'E']),
      ritation: expand(['y', 'z', 'x'])
    };

    this.moves = _.flatten(_.values(this.movesByType));

    this.metrics = {
      stm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [1, 1], ritation: [0, 0] },
      etm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [1, 1], ritation: [1, 1] },
      htm: { singleLayer: [1, 1], doubleLayer: [1, 1], slice: [2, 2], ritation: [0, 0] },
      qtm: { singleLayer: [1, 2], doubleLayer: [1, 2], slice: [2, 4], ritation: [0, 0] }
    };
  }

  stringToMoves(string) {
    return string.split('').reduce((moves, char) => {
      if(this.moves.includes(char)) {
        moves.push(char);
      } else if(moves.length) {
        let lastMove = moves.pop();
        if(this.moves.includes(lastMove + char)) {
          lastMove += char;
        }
        moves.push(lastMove);
      }
      return moves;
    }, []);
  }

  countMoves(moves) {
    return _.mapValues(this.metrics, metricData => {
      return _.reduce(this.movesByType, (count, movesOfTheType, moveType) => {
        let [singleMoveValue, doubleMoveValue] = metricData[moveType];
        return moves.filter(move => movesOfTheType.includes(move))
                    .reduce((count, move) => count + (move.includes('2') ? doubleMoveValue : singleMoveValue), count);
      }, 0);
    });
  }

  inversion(string) {
    return this.stringToMoves(string).map(move => this.moveInversion(move)).reverse().join(' ');
  }

  moveInversion(move) {
    let trimmedMove = _.trimEnd(move, "'");
    if(move.includes('2')) return trimmedMove;
    return move.endsWith("'") ? trimmedMove : `${trimmedMove}'`;
  }

  shrink(string) {
    return this.stringToMoves(string).join('');
  }
}
