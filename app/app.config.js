export default ($locationProvider, $urlRouterProvider) => {
  'ngInject';

  /* Set the default route. */
  $urlRouterProvider.otherwise('/');
};
