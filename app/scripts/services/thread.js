'use strict';

angular.module('linshareUiAdmin')
  .factory('Thread', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentThread = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('Thread:getAll');
          return Restangular.all('threads').getList().then(
            function success(threads) {
              if (successCallback) {
                return successCallback(threads);
              }
            },
            function error() {
              $log.error(
                [
                 'Thread:getAll',
                 'Unable to get all threads',
                ].join('\n')
              );
            }
          );
        },
        update: function(thread, successCallback) {
          $log.debug('Thread:update');
          return thread.put().then(
            function success(thread) {
              Notification.addSuccess('P_Users-Threads_ListUpdateSuccess');
              if (successCallback) {
                return successCallback(thread);
              }
            },
            function error() {
              $log.error(
                [
                 'Thread:update',
                 'Unable to update thread',
                ].join('\n')
              );
              $log.error(thread);
            }
          );
        },
        remove: function(thread, successCallback) {
          $log.debug('Thread:remove');
          return thread.remove().then(
            function success(thread) {
              Notification.addSuccess('P_Users-Threads_ListDeleteSuccess');
              if (successCallback) {
                return successCallback(thread);
              }
            },
            function error() {
              $log.error(
                [
                 'Thread:remove',
                 'Unable to remove thread',
                ].join('\n')
              );
              $log.error(thread);
            }
          );
        },
        setCurrent: function(thread) {
          $log.debug('Thread:setCurrent');
          self.currentThread = thread;
        },
        getCurrent: function() {
          return self.currentThread;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentThread);
        }
      };
    }
  ]
);
