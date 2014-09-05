'use strict';

angular.module('linshareAdminApp')
  .factory('MailContentLang',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

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
            function success(mailContentLang) {
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
        }
      };
    }
  ]
);
