'use strict';

/* Services */

angular.module('myApp.services')
  .factory('userLoggedService', ['$rootScope', '$log', 'Restangular',
  function($rootScope, $log, Restangular) {
    Restangular.all('authentication').customGET('authorized').then(function success(user) {
      $log.debug('Authentication succeed');
      $rootScope.userLogged = user;
    });
  }
]);
