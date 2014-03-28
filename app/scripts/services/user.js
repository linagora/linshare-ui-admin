'use strict';

angular.module('myApp.services')
  .factory('User', ['$log', 'Restangular',
    function ($log, Restangular) {
      var self = this;

      // Public API here
      return {
        autocomplete: function(pattern, successCallback) {
          $log.debug('User:autocomplete');
          return Restangular.all('users').one('autocomplete', pattern).get().then(
            function success(users) {
              return successCallback(users);
            },
            function error(response) {
              $log.error(
                [
                 'User:autocomplete',
                 'Unable to autocomplete users',
                ].join('\n')
              );
              $log.error(pattern);
            }
          );
        },
        search: function(pattern, successCallback) {
          $log.debug('User:search');
          return Restangular.all('users').one('search', pattern).get().then(
            function success(users) {
              angular.forEach(users, function(user, key) {
                user = Restangular.restangularizeElement(null, user, 'users');
              });
              return successCallback(users);
            },
            function error(response) {
              $log.error(
                [
                 'User:search',
                 'Unable to search users',
                ].join('\n')
              );
              $log.error(pattern);
            }
          );
        }
      };
    }
  ]
);
