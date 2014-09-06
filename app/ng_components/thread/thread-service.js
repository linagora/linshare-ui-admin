'use strict';

angular.module('linshareAdminApp')
  .factory('Thread', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('Thread:getAll');
          return Restangular.all('threads').getList();
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
        },
      };
    }
  ]
);
