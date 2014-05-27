'use strict';

angular.module('linshareAdminApp')
  .factory('MailConfig',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentMailConfig = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain, successCallback) {
          $log.debug('MailConfig:getAll');
          return Restangular.all('mail_configs')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain}).then(
              function success(mailConfigs) {
                if (successCallback) {
                  return successCallback(mailConfigs);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailConfig:getAll',
                   'Unable to get all mail configs for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        getAllMailContents: function(language, mailContentType, successCallback) {
          $log.debug('MailConfig:getAllMailContents');
          return Restangular.one('mail_configs', self.getCurrentId())
            .getList({language: language, mailContentType: mailContentType}).then(
              function success(mailConfigs) {
                if (successCallback) {
                  return successCallback(mailConfigs);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailConfig:getAll',
                   'Unable to get all mail contents with language',
                   language,
                   'and mail content type',
                   mailContentType
                  ].join('\n')
                );
              }
          );
        },
        get: function(domainId, mailConfigId, successCallback) {
          $log.debug('MailConfig:get');
          return Restangular.one('mail_configs', mailConfigId)
            .get({domainId: domainId}).then(
              function success(mailConfig) {
                if (successCallback) {
                  return successCallback(mailConfig);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailConfig:get',
                   'Unable to get the mail configs',
                   mailConfigId,
                   'for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        add: function(mailConfig, successCallback) {
          $log.debug('MailConfig:add');
          return Restangular.all('mail_configs').post(mailConfig).then(
            function success(mailConfig) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(mailConfig);
              }
            },
            function error() {
              $log.error(
                [
                 'MailConfig:add',
                 'Unable to create a mail content',
                ].join('\n')
              );
              $log.error(mailConfig);
            }
          );
        },
        update: function(mailConfig, successCallback) {
          $log.debug('MailConfig:update');
          return mailConfig.put().then(
            function success() {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mailConfig);
              }
            },
            function error() {
              $log.error(
                [
                 'MailConfig:update',
                 'Unable to update mail config',
                 mailConfig.uuid
                ].join('\n')
              );
              $log.error(mailConfig);
            }
          );
        },
        remove: function(mailConfig, successCallback) {
          $log.debug('MailConfig:remove');
          return mailConfig.remove().then(
            function success() {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(mailConfig);
              }
            },
            function error() {
              $log.error(
                [
                 'MailConfig:remove',
                 'Unable to remove mail config',
                 mailConfig.uuid
                ].join('\n')
              );
              $log.error(mailConfig);
            }
          );
        },
        setCurrent: function(mailConfig) {
          $log.debug('MailConfig:setCurrent');
          self.currentMailConfig = mailConfig;
        },
        getCurrent: function() {
          return self.currentMailConfig;
        },
        getCurrentId: function() {
          return self.currentMailConfig.uuid;
        },
        copyCurrent: function() {
          return Restangular.copy(self.currentMailConfig);
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMailConfig);
        }
      };
    }
  ]
);
