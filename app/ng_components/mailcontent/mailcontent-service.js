'use strict';

angular.module('linshareAdminApp')
  .factory('MailContent',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain, successCallback) {
          $log.debug('MailContent:getAll');
          return Restangular.all('mail_contents')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain}).then(
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
                   domainId
                  ].join('\n')
                );
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
        add: function(mailContent, successCallback) {
          $log.debug('MailContent:add');
          return Restangular.all('mail_contents').post(mailContent).then(
            function success(mailContent) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(mailContent);
              }
            },
            function error() {
              $log.error(
                [
                 'MailContent:add',
                 'Unable to create a mail content',
                ].join('\n')
              );
              $log.error(mailContent);
            }
          );
        },
        update: function(mailContent, successCallback) {
          $log.debug('MailContent:update');
          return mailContent.put().then(
            function success(mailContent) {
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
                 mailContent.uuid
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
                 mailContent.uuid
                ].join('\n')
              );
              $log.error(mailContent);
            }
          );
        },
      };
    }
  ]
);
