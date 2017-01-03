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
});
