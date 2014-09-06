'use strict';

angular.module('linshareAdminApp')
  .factory('MailFooter',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain) {
          $log.debug('MailFooter:getAll');
          return Restangular.all('mail_footers')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain});
        },
        get: function(domainId, mailFooterId) {
          $log.debug('MailFooter:get');
          return Restangular.one('mail_footers', mailFooterId)
            .get({domainId: domainId});
        },
        add: function(mailFooter) {
          $log.debug('MailFooter:add');
          return Restangular.all('mail_footers').post(mailFooter).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(mailFooter) {
          $log.debug('MailFooter:update');
          return mailFooter.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(mailFooter) {
          $log.debug('MailFooter:remove');
          return mailFooter.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        },
      };
    }
  ]
);
