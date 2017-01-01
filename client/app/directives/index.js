import angular from 'angular';
import ngMaterial from 'angular-material';

import cubeDrawing from './cube-drawing.directive';

export default angular
  .module('app.directives', [ngMaterial])
  .directive('cubeDrawing', cubeDrawing)
  .name;
