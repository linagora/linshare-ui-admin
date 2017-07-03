'use strict';

angular.module('linshareAdminApp')
  .factory('MailFooterLang',
    ['$log', 'Notification', 'Restangular',
    function($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        get: function(mailFooterLangId) {
          $log.debug('MailContenLang:get');
          return Restangular.one('mail_footer_langs', mailFooterLangId).get();
        },
        update: function(mailFooterLang) {
          $log.debug('MailFooterLang:update');
          return Restangular.all('mail_footer_langs').customPUT(mailFooterLang).then(function() {
            Notification.addSuccess('UPDATE');
          });
        }
      };
    }
  ]
);
