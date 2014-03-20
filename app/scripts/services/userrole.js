'use strict';

angular.module('myApp.services')
  .factory('UserRole', ['$log', 'Restangular',
    function ($log, Restangular) {

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('UserRole:getAll');
          Restangular.all('user_roles').getList().then(
            function success(userRoles) {
              successCallback(userRoles);
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
