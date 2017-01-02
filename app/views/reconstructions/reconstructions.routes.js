import newTemplate from './new/new.view.html';
import showTemplate from './show/show.view.html';

export default ($stateProvider) => {
  'ngInject';

  $stateProvider
    .state('reconstructions', {
      abstract: true,
      template: '<ui-view></ui-view>'
    })
    .state('reconstructions.new', {
      url: '/',
      template: newTemplate,
      controller: 'ReconstructionsNewController',
      controllerAs: 'vm'
    })
    .state('reconstructions.show', {
      url: '/show?scramble&solution',
      template: showTemplate,
      controller: 'ReconstructionsShowController',
      controllerAs: 'vm'
    });
};
