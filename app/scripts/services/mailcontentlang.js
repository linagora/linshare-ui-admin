'use strict';

angular.module('linshareAdminApp')
  .factory('MailContentLang',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentMailContentLang = undefined;

      var self = this;

      // Public API here
      return {
        get: function(mailContentLangId, successCallback) {
          $log.debug('MailContenLang:get');
          return Restangular.one('mail_content_langs', mailContentLangId)
            .get().then(
              function success(mailContentLang) {
                if (successCallback) {
                  return successCallback(mailContentLang);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailContentLang:get',
                   'Unable to get the mail content lang',
                   mailContentLangId
                  ].join('\n')
                );
              }
          );
        },
        update: function(mailContentLang, successCallback) {
          $log.debug('MailContentLang:update');
          return mailContentLang.put().then(
            function success() {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mailContentLang);
              }
            },
            function error() {
              $log.error(
                [
                 'MailContentLang:update',
                 'Unable to update mail content lang',
                 mailContentLang.uuid
                ].join('\n')
              );
              $log.error(mailContentLang);
            }
          );
        },
        setCurrent: function(mailContentLang) {
          $log.debug('MailContentLang:setCurrent');
          self.currentMailContentLang = mailContentLang;
        },
        getCurrent: function() {
          return self.currentMailContentLang;
        },
        copyCurrent: function() {
          return Restangular.copy(self.currentMailContentLang);
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMailContentLang);
        }
      };
    }
  ]
);
