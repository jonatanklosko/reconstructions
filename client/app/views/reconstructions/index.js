import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngClipboard from 'angular-clipboard';

import routing from './reconstructions.routes';

import ReconstructionsNewController from './new/new.controller';
import ReconstructionsShowController from './show/show.controller';

export default angular
  .module('app.views.reconstructions', [uiRouter, ngClipboard.name])
  .config(routing)
  .controller('ReconstructionsNewController', ReconstructionsNewController)
  .controller('ReconstructionsShowController', ReconstructionsShowController)
  .name;
