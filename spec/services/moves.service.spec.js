import angular from 'angular';

describe('MovesService', () => {
  beforeEach(angular.mock.module('app.services'));

  let MovesService;

  beforeEach(angular.mock.inject((_MovesService_) => {
    MovesService = _MovesService_;
  }));

  describe('stringToMoves', () => {
    it('returns an empty array for an empty string', () => {
      expect(MovesService.stringToMoves('')).toEqual([]);
    });

    it('ignores invalid characters', () => {
      expect(MovesService.stringToMoves('R o L4')).toEqual(['R', 'L']);
    });

    it('handles correctly a lack of white characters', () => {
      expect(MovesService.stringToMoves("R'UL2MbF'")).toEqual(["R'", 'U', 'L2', 'M', 'b', "F'"]);
    });

    it('attaches prime and two signs to their corresponding moves regerdless white characters', () => {
      expect(MovesService.stringToMoves("R  'u 2M2'")).toEqual(["R'", 'u2', "M2'"]);
    });
  });

  describe('countMoves', () => {
    let moves = "M2 y U R' F2 d S2' z r2".split(' ');

    describe('stm', () => {
      it('counts any turn by any angle as a one move', () => {
        expect(MovesService.countMoves(moves).stm).toEqual(7);
      });
    });

    describe('etm', () => {
      it('counts any turn by any angle as a one move additionally treating any rotation as a move', () => {
        expect(MovesService.countMoves(moves).etm).toEqual(9);
      });
    });

    describe('html', () => {
      it('counts any move by any angle as a one move, except slices that are counted as two moves', () => {
        expect(MovesService.countMoves(moves).htm).toEqual(9);
      });
    });

    describe('qtml', () => {
      it('counts any move by 90 degrees as a one move, except slices that are counted as two moves per 90 degrees', () => {
        expect(MovesService.countMoves(moves).qtm).toEqual(15);
      });
    });
  });

  describe('moveInversion', () => {
    it('turns both 2\' and 2 into 2', () => {
      expect(MovesService.inversion('U2')).toEqual('U2');
      expect(MovesService.inversion("U2'")).toEqual('U2');
    });

    it('returns counter-clockwise move when a clockwise move is given', () => {
      expect(MovesService.inversion('U')).toEqual("U'");
    });

    it('returns clockwise move when an counter-clockwise move is given', () => {
      expect(MovesService.inversion("U'")).toEqual('U');
    });
  });
});
