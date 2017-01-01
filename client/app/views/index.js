import angular from 'angular';

import layout from './layout';
import reconstructions from './reconstructions';

export default angular
  .module('app.views', [
    layout,
    reconstructions
  ])
  .name;
