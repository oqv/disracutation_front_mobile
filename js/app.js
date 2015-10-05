var app = angular.module('oqvMobileApp', ['ui.router', 'ngResource', 'ngSanitize', 'restangular', 'ui.bootstrap']);

app.run(function($rootScope, $state){

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $state.previousState = fromState;
    $state.previousParams = fromParams;

    $state.toState = toState;
    $state.toStateParams = toParams;

  });

});
