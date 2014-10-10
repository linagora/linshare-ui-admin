'use strict';

angular.module('linshareAdminApp')
  .factory('MailContent',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain) {
          $log.debug('MailContent:getAll');
          return Restangular.all('mail_contents').getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain});
        },
        get: function(domainId, mailContentId) {
          $log.debug('MailContent:get');
          return Restangular.one('mail_contents', mailContentId).get({domainId: domainId});
        },
        add: function(mailContent) {
          $log.debug('MailContent:add');
          return Restangular.all('mail_contents').post(mailContent).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(mailContent) {
          $log.debug('MailContent:update');
          return mailContent.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(mailContent) {
          $log.debug('MailContent:remove');
          return mailContent.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        },
      };
    }
  ]
);
