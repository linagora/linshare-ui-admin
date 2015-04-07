'use strict';

angular.module('linshareAdminApp')
  .factory('User', ['$q', '$log', 'Restangular', 'Notification',
    function ($q, $log, Restangular, Notification) {
      // var self = this;

      // Public API here
      return {
        autocomplete: function(pattern) {
          $log.debug('User:autocomplete');
          return Restangular.all('users').one('autocomplete', pattern).get();
        },
        search: function(userSearchDto) {
          $log.debug('User:search');
          return Restangular.all('users').customPOST(userSearchDto, 'search').then(function(users) {
            angular.forEach(users, function(user) {
              user = Restangular.restangularizeElement(null, user, 'users');
            });
            var dfd = $q.defer();
            dfd.resolve(users);
            return dfd.promise;
          });
        },
        get: function(uuid) {
          $log.debug('User:get');
          return Restangular.one('users', uuid).get();
        },
        exist: function(uuid) {
          $log.debug('User:exist');
          return Restangular.one('users', uuid).head();
        },
        getAllInconsistent: function() {
          $log.debug('User:getAllInconsistent');
          return Restangular.all('users').all('inconsistent').getList();
        },
        update: function(user) {
          $log.debug('User:update');
          return user.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(user) {
          $log.debug('User:remove');
          return user.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
