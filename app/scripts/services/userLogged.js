'use strict';

/* Services */

angular.module('myApp.services')
  .factory('userLoggedService', ['$rootScope', 'Restangular', 'loggerService',
  function($rootScope, Restangular ,Logger) {
    var UserLogged = {};
    Restangular.all('authentication').customGET('authorized').then(function success(user) {
      UserLogged = user;
    }, function error() {
      Logger.error('Unable to reach authentication url');
    });
    console.log(UserLogged);
    return {
      get: function() {
        return UserLogged;
      }
    }
  }
]);
