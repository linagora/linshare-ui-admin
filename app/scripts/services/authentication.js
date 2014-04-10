'use strict';

/* Services */

angular.module('myApp.services')
  .factory('Authentication',
    ['$route', '$http', '$q', '$log', 'authService', 'Restangular',
    function($route, $http, $q, $log, authService, Restangular) {
      var deferred = $q.defer();
      var self = this;

      // Do at least one authentication request
      // to handle reload of already connected user
      Restangular.all('authentication').customGET('authorized').then(
        function success(user) {
          deferred.resolve(user);
        }
      );

      // Public API here
      return {
        request: function(login, password, errorCallback) {
          $log.debug('Authentication:request');
          return Restangular.all('authentication').customGET('authorized', {
            // QueryParams - Bypass the module authService
            ignoreAuthModule: true
          }, {
            // Headers - Add login password
            Authorization: 'Basic ' + Base64.encode(login + ':' + password)
          }).then(
            function success(user) {
              $log.debug('Connected as ' + user.mail);
              deferred.resolve(user);
              authService.loginConfirmed();
            }, function error() {
              $log.error(
                [
                 'Authentication:request',
                 'Authentication failed',
                ].join('\n')
              );
              return errorCallback();
            }
          );
        },
        logout: function() {
          return $http.get('linshare/j_spring_security_logout').success(function() {
            $log.debug("Authentication:logout");
            $route.reload();
          }).error(function() {
            $log.error(
              [
               'Authentication:logout',
               'Unable to reach logout url',
              ].join('\n')
            );
          });
        },
        getCurrentUser: function() {
          return deferred.promise;
        }
      };
    }
  ]
);
