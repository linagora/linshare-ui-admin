'use strict';

angular.module('linshareAdminApp')
  .factory('ThreadMember', ['$log', 'Restangular',
    function ($log, Restangular) {
      var getThreadMemberDto = function(thread, user) {
        return {
          'threadUuid': thread.uuid,
          'userUuid': user.uuid,
          'userMail': user.mail,
          'userDomainId': user.domain
        };
      };

      // var self = this;

      // Public API here
      return {
        getAll: function(thread, successCallback) {
          $log.debug('ThreadMember:getAll');
          return Restangular.one('threads', thread.uuid).all('members').getList().then(
            function success(threadMembers) {
              if (successCallback) {
                return successCallback(threadMembers);
              }
            },
            function error() {
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
        add: function(thread, user, successCallback) {
          $log.debug('ThreadMember:add');
          var threadMember = getThreadMemberDto(thread, user);
          return Restangular.all('thread_members').post(threadMember).then(
            function success(threadMember) {
              if (successCallback) {
                return successCallback(threadMember);
              }
            },
            function error() {
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
          return Restangular.all('thread_members').customPUT(threadMember).then(
            function success(threadMember) {
              if (successCallback) {
                return successCallback(threadMember);
              }
            },
            function error() {
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
          return Restangular.all('thread_members').customOperation('remove', '', {}, {}, threadMember).then(
            function success(threadMember) {
              if (successCallback) {
                return successCallback(threadMember);
              }
            },
            function error() {
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

