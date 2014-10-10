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
        getAll: function(thread) {
          $log.debug('ThreadMember:getAll');
          return Restangular.one('threads', thread.uuid).all('members').getList();
        },
        add: function(thread, user) {
          $log.debug('ThreadMember:add');
          var threadMember = getThreadMemberDto(thread, user);
          return Restangular.all('thread_members').post(threadMember);
        },
        update: function(threadMember) {
          $log.debug('ThreadMember:update');
          return Restangular.all('thread_members').customPUT(threadMember);
        },
        remove: function(threadMember) {
          $log.debug('ThreadMember:remove');
          return Restangular.all('thread_members').customOperation('remove', '', {}, {}, threadMember);
        },
      };
    }
  ]
);

