'use strict';

angular.module('linshareAdminApp')
  .factory('MailFooter',
    ['$log', '$translate', 'Notification', 'Restangular',
    function ($log, $translate, Notification, Restangular) {
      this.currentMailFooter = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(domain, successCallback) {
          $log.debug('MailFooter:getAll');
          return Restangular.all('mail_footers')
            .getList({domainId: domain.identifier}).then(
              function success(mailFooters) {
                if (successCallback) {
                  return successCallback(mailFooters);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailFooter:getAll',
                   'Unable to get all mail footer for domain',
                   domain.identifier
                  ].join('\n')
                );
                $log.error(domain);
              }
          );
        },
        get: function(domainId, mailFooterId, successCallback) {
          $log.debug('MailFooter:get');
          return Restangular.one('mail_footers', mailFooterId)
            .get({domainId: domainId}).then(
              function success(mailFooter) {
                if (successCallback) {
                  return successCallback(mailFooter);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailFooter:get',
                   'Unable to get the mail footers',
                   mailFooterId,
                   'for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        add: function(mailFooter, successCallback) {
          $log.debug('MailFooter:add');
          return Restangular.all('mail_footers').post(mailFooter).then(
            function success(mailFooter) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(mailFooter);
              }
            },
            function error() {
              $log.error(
                [
                 'MailFooter:add',
                 'Unable to create a mail content',
                ].join('\n')
              );
              $log.error(mailFooter);
            }
          );
        },
        update: function(mailFooter, successCallback) {
          $log.debug('MailFooter:update');
          return mailFooter.put().then(
            function success() {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mailFooter);
              }
            },
            function error() {
              $log.error(
                [
                 'MailFooter:update',
                 'Unable to update mail footer',
                 mailFooter.identifier
                ].join('\n')
              );
              $log.error(mailFooter);
            }
          );
        },
        remove: function(mailFooter, successCallback) {
          $log.debug('MailFooter:remove');
          return mailFooter.remove().then(
            function success() {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(mailFooter);
              }
            },
            function error() {
              $log.error(
                [
                 'MailFooter:remove',
                 'Unable to remove mail footer',
                 mailFooter.identifier
                ].join('\n')
              );
              $log.error(mailFooter);
            }
          );
        },
        setCurrent: function(mailFooter) {
          $log.debug('MailFooter:setCurrent');
          self.currentMailFooter = mailFooter;
        },
        getCurrent: function() {
          return self.currentMailFooter;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMailFooter);
        }
      };
    }
  ]
);
