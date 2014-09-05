'use strict';

angular.module('linshareAdminApp')
  .factory('MailingList', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('MailingList:getAll');
          return Restangular.all('lists').getList().then(
            function success(mails) {
              if (successCallback) {
                return successCallback(mails);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:getAll',
                 'Unable to get all mailing lists',
                ].join('\n')
              );
            }
          );
        },
        get: function(mailId, successCallback) {
          $log.debug('MailingList:get');
          return Restangular.one('lists', mailId).get().then(
            function success(mail) {
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:get',
                 'Unable to get mailing list',
                 mailId
                ].join('\n')
              );
            }
          );
        },
        update: function(mail, successCallback) {
          $log.debug('MailingList:update');
          return mail.put().then(
            function success(mail) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:update',
                 'Unable to update mailing list',
                ].join('\n')
              );
              $log.error(mail);
            }
          );
        },
        remove: function(mail, successCallback) {
          $log.debug('MailingList:remove');
          return mail.remove().then(
            function success(mail) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:remove',
                 'Unable to remove mailing list',
                ].join('\n')
              );
              $log.error(mail);
            }
          );
        },
        addContact: function(mailId, contact, successCallback) {
          $log.debug('MailingList:addContact');
          return Restangular.one('lists', mailId).all('contacts').customPOST(contact).then(
            function success(contact) {
              if (successCallback) {
                return successCallback(contact);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:addContact',
                 'Unable to add contact',
                 mailId
                ].join('\n')
              );
              $log.error(contact);
            }
          );
        },
        removeContact: function(mailId, contact, successCallback) {
          $log.debug('MailingList:removeContact');
          return Restangular.one('lists', mailId).all('contacts').customOperation('remove', '', {}, {}, contact).then(
            function success(contact) {
              if (successCallback) {
                return successCallback(contact);
              }
            },
            function error() {
              $log.error(
                [
                 'MailingList:removeContact',
                 'Unable to remove contact in',
                 mailId
                ].join('\n')
              );
              $log.error(contact);
            }
          );
        },
      };
    }
  ]
);
