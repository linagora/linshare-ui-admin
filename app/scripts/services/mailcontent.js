'use strict';

angular.module('linshareAdminApp')
  .factory('MailContent',
    ['$log', '$translate', 'Notification', 'Restangular',
    function ($log, $translate, Notification, Restangular) {
      this.currentMailContent = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(domain, successCallback) {
          $log.debug('MailContent:getAll');
          return Restangular.all('mail_contents')
            .getList({domainId: domain.identifier}).then(
              function success(mailContents) {
                if (successCallback) {
                  return successCallback(mailContents);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailContent:getAll',
                   'Unable to get all mail contents for domain',
                   domain.identifier
                  ].join('\n')
                );
                $log.error(domain);
              }
          );
        },
        get: function(domainId, mailContentId, successCallback) {
          $log.debug('MailContent:get');
          return Restangular.one('mail_contents', mailContentId)
            .get({domainId: domainId}).then(
              function success(mailContent) {
                if (successCallback) {
                  return successCallback(mailContent);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailContent:get',
                   'Unable to get the mail contents',
                   mailContentId,
                   'for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        update: function(mailContent, successCallback) {
          $log.debug('MailContent:update');
          return mailContent.put().then(
            function success() {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mailContent);
              }
            },
            function error() {
              $log.error(
                [
                 'MailContent:update',
                 'Unable to update mail content',
                 mailContent.identifier
                ].join('\n')
              );
              $log.error(mailContent);
            }
          );
        },
        remove: function(mailContent, successCallback) {
          $log.debug('MailContent:remove');
          return mailContent.remove().then(
            function success() {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(mailContent);
              }
            },
            function error() {
              $log.error(
                [
                 'MailContent:remove',
                 'Unable to remove mail content',
                 mailContent.identifier
                ].join('\n')
              );
              $log.error(mailContent);
            }
          );
        },
        setCurrent: function(mailContent) {
          $log.debug('MailContent:setCurrent');
          self.currentMailContent = mailContent;
        },
        getCurrent: function() {
          return self.currentMailContent;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMailContent);
        }
      };
    }
  ]
);
