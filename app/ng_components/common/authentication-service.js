'use strict';

/* Services */

angular.module('linshareAdminApp')
  .factory('Authentication',
    ['$route', '$cookies', '$q', '$log', 'Base64', 'Restangular', 'authService', 'Notification',
    function($route, $cookies, $q, $log, Base64, Restangular, authService, Notification) {
      var deferred = $q.defer();
      this.waitingForResponse = false;

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
          self.waitingForResponse = true;
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
              self.waitingForResponse = false;
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
        changePassword: function(password) {
          $log.debug('Authentication:changePassword');
          Restangular.all('authentication').all('change_password').post(password).then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        logout: function() {
          $log.debug('Authentication:logout');
          Restangular.all('authentication').one('logout').get().then(function() {
            delete $cookies.JSESSIONID;
            // Reload authentication modal
            Restangular.all('authentication').customGET('authorized').then(function(user) {
                deferred.resolve(user);
            });
          });
        },
        version: function() {
          $log.debug('Authentication:version');
          return Restangular.one('authentication', 'version').get();
        },
        isWaitingForResponse: function() {
          return self.waitingForResponse;
        },
        getCurrentUser: function() {
          return deferred.promise;
        }
      };
    }
  ]
);
