'use strict';

angular.module('linshareAdminApp')
  .factory('Thread', ['$q', '$log', 'Restangular', 'Notification', 'customDeleteService',
    function($q, $log, Restangular, Notification, customDeleteService) {
      var restUrl = 'shared_spaces';

      // Public API here
      return {
        getAll: function(pattern) {
          $log.debug('Thread:getAll');
          if (pattern == null) {
            return Restangular.all(restUrl).getList();
          }
          return Restangular.all(restUrl).getList({pattern:pattern});
        },
        get: function(id) {
          $log.debug('Thread:get');
          return Restangular.one(restUrl, id).get();
        },
        update: function(thread) {
          $log.debug('Thread:update');
          return thread.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(thread) {
          $log.debug('Thread:remove');
          return customDeleteService.remove('shared_spaces', thread).then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
