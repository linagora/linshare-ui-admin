'use strict';

angular.module('myApp.services')
  .factory('UserRole', ['$log', 'Restangular',
    function ($log, Restangular) {
      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('UserRole:getAll');
          return Restangular.all('user_roles').getList().then(
            function success(userRoles) {
              if (successCallback) {
                return successCallback(userRoles);
              }
            },
            function error(response) {
              $log.error(
                [
                 'UserRole:getAll',
                 'Unable to get all user roles',
                ].join('\n')
              );
            }
          );
        }
      };
    }
  ]
);
