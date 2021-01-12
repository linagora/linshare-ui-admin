'use strict';

angular.module('linshareAdminApp')
  .factory('MailConfig',
    ['$log', 'Notification', 'Restangular', 'customDeleteService',
    function($log, Notification, Restangular, customDeleteService) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain) {
          $log.debug('MailConfig:getAll');
          return Restangular.all('mail_configs')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain});
        },
        getAllMailContents: function(mailConfigUuid, language, mailContentType) {
          $log.debug('MailConfig:getAllMailContents');
          return Restangular.one('mail_configs', mailConfigUuid)
            .getList('mail_contents', {language: language, mailContentType: mailContentType});
        },
        getAllMailFooters: function(mailConfigUuid, language) {
          $log.debug('MailConfig:getAllMailFooters');
          return Restangular.one('mail_configs', mailConfigUuid)
            .getList('mail_footers', {language: language});
        },
        get: function(domainId, mailConfigId) {
          $log.debug('MailConfig:get');
          return Restangular.one('mail_configs', mailConfigId)
            .get({domainId: domainId});
        },
        add: function(mailConfig) {
          $log.debug('MailConfig:add');
          return Restangular.all('mail_configs').post(mailConfig).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(mailConfig) {
          $log.debug('MailConfig:update');
          return mailConfig.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(mailConfig) {
          $log.debug('MailConfig:remove');
          return customDeleteService.remove('mail_configs', mailConfig).then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
