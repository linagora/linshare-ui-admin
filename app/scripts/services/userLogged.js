'use strict';

/* Services */

angular.module('myApp.services')
  .factory('userLoggedService', ['$rootScope', 'Restangular', 'loggerService',
  function($rootScope, Restangular ,Logger) {
    var UserLogged = {};
    Restangular.all('authentication').customGET('authorized').then(function success(user) {
      $rootScope.userLogged = user;
    });
    return {
      get: function() {
        return UserLogged;
      }
    }
  }
]);
