'use strict';

angular.module('linshareAdminApp')
  .factory('MailingList', ['$log', 'Restangular', 'Notification', 'customDeleteService',
    function($log, Restangular, Notification, customDeleteService) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('MailingList:getAll');
          return Restangular.all('lists').getList();
        },
        get: function(mailId) {
          $log.debug('MailingList:get');
          return Restangular.one('lists', mailId).get();
        },
        update: function(mail) {
          $log.debug('MailingList:update');
          return mail.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(mail) {
          $log.debug('MailingList:remove');
          return customDeleteService.remove('lists', mail).then(function() {
            Notification.addSuccess('DELETE');
          });
        },
        addContact: function(mailId, contact) {
          $log.debug('MailingList:addContact');
          return Restangular.one('lists', mailId).all('contacts').customPOST(contact);
        },
        removeContact: function(mailId, contact) {
          $log.debug('MailingList:removeContact');
          return customDeleteService.remove('lists/' + mailId + '/contacts', contact, true);
        }
      };
    }
  ]
);
