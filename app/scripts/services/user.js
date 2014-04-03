'use strict';

angular.module('myApp.services')
  .factory('User', ['$log', 'Restangular',
    function ($log, Restangular) {
      this.currentUser = undefined;

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
        search: function(userSearchDto, successCallback) {
          $log.debug('User:search');
          return Restangular.all('users').customPOST(userSearchDto, 'search').then(
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
              $log.error(userSearchDto);
            }
          );
        },
        setCurrent: function(user) {
          $log.debug('User:setCurrent');
          self.currentUser = user;
        },
        getCurrent: function() {
          return self.currentUser;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentUser);
        }
      };
    }
  ]
);
