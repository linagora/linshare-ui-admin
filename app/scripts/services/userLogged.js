'use strict';

/* Services */

angular.module('myApp.services')
  .factory('userLoggedService', ['$rootScope', 'Restangular', 'loggerService',
  function($rootScope, Restangular ,Logger) {
    Restangular.all('authentication').customGET('authorized').then(function success(user) {
      Logger.debug('Authentication succeed');
      $rootScope.userLogged = user;
    });
  }
]);
