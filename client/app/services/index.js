import angular from 'angular';

import MovesService from './moves.service';
import CubeService from './cube.service';
import CfopAnalyzer from './cfop-analyzer.service';

export default angular
  .module('app.services', [])
  .service('MovesService', MovesService)
  .service('CubeService', CubeService)
  .service('CfopAnalyzer', CfopAnalyzer)
  .name;
