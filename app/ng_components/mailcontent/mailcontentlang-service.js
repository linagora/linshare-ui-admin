'use strict';

angular.module('linshareAdminApp')
  .factory('MailContentLang',
    ['$log', 'Notification', 'Restangular',
    function($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        get: function(mailContentLangId) {
          $log.debug('MailContenLang:get');
          return Restangular.one('mail_content_langs', mailContentLangId).get();
        },
        update: function(mailContentLang) {
          $log.debug('MailContentLang:update');
          return mailContentLang.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        }
      };
    }
  ]
);
