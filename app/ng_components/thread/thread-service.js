'use strict';

angular.module('linshareAdminApp')
  .factory('Thread', ['$q', '$log', 'Restangular', 'Notification',
    function ($q, $log, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function(pattern) {
          $log.debug('Thread:getAll');
          if (pattern == null)
            return Restangular.all('threads').getList();
          return Restangular.all('threads').getList({pattern:pattern});
        },
        get: function(id) {
          $log.debug('Thread:get');
          return Restangular.one('threads', id).get();
        },
        update: function(thread) {
          $log.debug('Thread:update');
          return thread.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(thread) {
          $log.debug('Thread:remove');
          return thread.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
