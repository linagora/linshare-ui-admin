'use strict';

angular.module('myApp.services')
  .factory('Thread', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentThread = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('Thread:getAll');
          Restangular.all('threads').getList().then(
            function success(threads) {
              if (successCallback) {
                successCallback(threads);
              }
            },
            function error(response) {
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
          thread.put().then(
            function success(thread) {
              Notification.addSuccess('P_Domains-Threads_UpdateSuccess');
              if (successCallback) {
                successCallback(thread);
              }
            },
            function error(response) {
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
          thread.remove().then(
            function success(thread) {
              Notification.addSuccess('P_Threads-_DeleteSuccess');
              if (successCallback) {
                successCallback(thread);
              }
            },
            function error(response) {
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
