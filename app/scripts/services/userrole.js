'use strict';

angular.module('myApp.services')
  .factory('UserRole', ['$log', 'Restangular',
    function ($log, Restangular) {

      // Public API here
      return {
        getAllUserRoles: function(successCallback) {
          $log.debug('UserRole:getAllUserRoles');
          Restangular.all('user_roles').getList().then(
            function success(userRoles) {
              successCallback(userRoles);
            }
          ,
            function error() {
              $log.error(
                [
                 'UserRole:getAllUserRoles',
                 'Unable to get all user roles'
                ].join('\n')
              );
            }
          );
        }
      };
    }
  ]
);
