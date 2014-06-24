'use strict';

/* Services */

angular.module('linshareAdminApp')
  .factory('Authentication',
    ['$route', '$cookies', '$q', '$log', 'Restangular', 'authService', 'Notification',
    function($route, $cookies, $q, $log, Restangular, authService, Notification) {
      var deferred = $q.defer();
      
      // var self = this;

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
            }, function error(response) {
              $log.error(
                [
                 'Authentication:request',
                 'Authentication failed',
                 response.status
                ].join('\n')
              );
              return errorCallback();
            }
          );
        },
        isSuperAdmin: function(user) {
          return user.role === 'SUPERADMIN';
        },
        changePassword: function(password, successCallback) {
          $log.debug('Authentication:changePassword');
          Restangular.all('authentication').all('change_password').post(password).then(
            function success() {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                successCallback();
              }
            },
            function error() {
              $log.error(
                [
                 'Authentication:changePassword',
                 'Unable to change the password',
                ].join('\n')
              );
              $log.error(password);
            }
          );
        },
        logout: function() {
          $log.debug('Authentication:logout');
          Restangular.all('authentication').one('logout').get({
            // QueryParams - Bypass the module authService
            ignoreAuthModule: true
          }).then(function() {
            authService.loginCancelled(true, true);
            delete $cookies.JSESSIONID;
          });
          //location.reload(true);
        },
        getCurrentUser: function() {
          return deferred.promise;
        }
      };
    }
  ]
);
