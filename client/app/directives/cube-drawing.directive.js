import template from './cube-drawing.template.html';
import * as _ from 'lodash';

export default () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
      moves: '='
    },
    controller: class CubeDrawingController {
      constructor($scope, $element, CubeService) {
        'ngInject';
        this.$element = $element;
        this.cube = new CubeService.Cube();
        $scope.$watch('moves', moves => {
          this.cube.reset();
          this.cube.applyMoves(moves);
          this.draw();
        });
      }

      draw() {
        _.each(this.cube.stickers, (value, sticker) => {
          let colorClasses = { 'U': 'up', 'D': 'down', 'R': 'right', 'L': 'left', 'F': 'front', 'B': 'back' };
          this.$element.find(`.sticker.${sticker}`)
            .removeClass(_.values(colorClasses).join(' '))
            .addClass(colorClasses[value]);
        });
      }
    }
  };
};
