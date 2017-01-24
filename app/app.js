import '../assets/sass/main.scss';

import 'babel-polyfill';

import 'jquery';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMaterialDataTable from 'angular-material-data-table';

import config from './app.config';

import services from './services';
import directives from './directives';
import views from './views';
import constants from './constants';

angular
  .module('app', [
    uiRouter,
    ngMaterial,
    ngMaterialDataTable,
    services,
    directives,
    views,
    constants
  ])
  .config(config);
