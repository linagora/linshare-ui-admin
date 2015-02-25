'use strict';

angular.module('linshareAdminApp')
  .factory('MailLayout',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain) {
          $log.debug('MailLayout:getAll');
          return Restangular.all('mail_layouts')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain});
        },
        get: function(domainId, mailLayoutId) {
          $log.debug('MailLayout:get');
          return Restangular.one('mail_layouts', mailLayoutId).get({domainId: domainId});
        },
        add: function(mailLayout) {
          $log.debug('MailLayout:add');
          return Restangular.all('mail_layouts').post(mailLayout).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(mailLayout) {
          $log.debug('MailLayout:update');
          return mailLayout.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(mailLayout) {
          $log.debug('MailLayout:remove');
          return mailLayout.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
