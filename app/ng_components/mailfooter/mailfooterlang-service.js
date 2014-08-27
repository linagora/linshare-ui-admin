'use strict';

angular.module('linshareAdminApp')
  .factory('MailFooterLang',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentMailFooterLang = undefined;

      var self = this;

      // Public API here
      return {
        get: function(mailFooterLangId, successCallback) {
          $log.debug('MailContenLang:get');
          return Restangular.one('mail_footer_langs', mailFooterLangId)
            .get().then(
              function success(mailFooterLang) {
                if (successCallback) {
                  return successCallback(mailFooterLang);
                }
              },
              function error() {
                $log.error(
                  [
                   'MailFooterLang:get',
                   'Unable to get the mail footer lang',
                   mailFooterLangId
                  ].join('\n')
                );
              }
          );
        },
        update: function(mailFooterLang, successCallback) {
          $log.debug('MailFooterLang:update');
          return Restangular.all('mail_footer_langs').customPUT(mailFooterLang).then(
            function success(mailFooterLang) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mailFooterLang);
              }
            },
            function error() {
              $log.error(
                [
                 'MailFooterLang:update',
                 'Unable to update mail footer lang',
                 mailFooterLang.uuid
                ].join('\n')
              );
              $log.error(mailFooterLang);
            }
          );
        },
        setCurrent: function(mailFooterLang) {
          $log.debug('MailFooterLang:setCurrent');
          self.currentMailFooterLang = mailFooterLang;
        },
        getCurrent: function() {
          return self.currentMailFooterLang;
        },
        copyCurrent: function() {
          return Restangular.copy(self.currentMailFooterLang);
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMailFooterLang);
        }
      };
    }
  ]
);
