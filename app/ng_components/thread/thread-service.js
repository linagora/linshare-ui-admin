'use strict';

angular.module('linshareAdminApp')
  .factory('Thread', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      //var self = this;

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
        get: function(id, successCallback) {
          $log.debug('Thread:get');
          return Restangular.one('threads', id).get().then(
            function success(threads) {
              if (successCallback) {
                return successCallback(threads);
              }
            },
            function error() {
              $log.error(
                [
                 'Thread:get',
                 'Unable to get a thread',
                ].join('\n')
              );
            }
          );
        },
        update: function(thread, successCallback) {
          $log.debug('Thread:update');
          return thread.put().then(
            function success(thread) {
              Notification.addSuccess('UPDATE');
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
              Notification.addSuccess('DELETE');
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
      };
    }
  ]
);
