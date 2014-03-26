'use strict';

angular.module('myApp.services')
  .factory('ThreadMember', ['$log', 'Restangular',
    function ($log, Restangular) {
      var self = this;

      // Public API here
      return {
        getAll: function(thread, successCallback) {
          $log.debug('ThreadMember:getAll');
          Restangular.one('threads', thread.uuid).all('members').getList().then(
            function success(threadMembers) {
              if (successCallback) {
                successCallback(threadMembers);
              }
            },
            function error(response) {
              $log.error(
                [
                 'ThreadMember:getAll',
                 'Unable to get all thread members',
                ].join('\n')
              );
              $log.error(thread);
            }
          );
        },
        add: function(thread, threadMember, successCallback) {
          $log.debug('ThreadMember:add');
          Restangular.one('threads', thread.identifier).all('members').post(threadMember).then(
            function success(threadMember) {
              if (successCallback) {
                successCallback(threadMember);
              }
            },
            function error(response) {
              $log.error(
                [
                 'ThreadMember:add',
                 'Unable to add thread member'
                ].join('\n')
              );
              $log.error(thread);
              $log.error(threadMember);
            }
          );
        },
        update: function(threadMember, successCallback) {
          $log.debug('ThreadMember:update');
          threadMember.put().then(
            function success(threadMember) {
              if (successCallback) {
                successCallback(threadMember);
              }
            },
            function error(response) {
              $log.error(
                [
                 'ThreadMember:update',
                 'Unable to update thread member',
                ].join('\n')
              );
              $log.error(threadMember);
            }
          );
        },
        remove: function(threadMember, successCallback) {
          $log.debug('ThreadMember:remove');
          threadMember.remove().then(
            function success(threadMember) {
              if (successCallback) {
                successCallback(threadMember);
              }
            },
            function error(response) {
              $log.error(
                [
                 'ThreadMember:remove',
                 'Unable to remove thread member',
                ].join('\n')
              );
              $log.error(threadMember);
            }
          );
        },
      };
    }
  ]
);

