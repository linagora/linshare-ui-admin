'use strict';

angular.module('linshareUiAdmin')
  .factory('Mail', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentMail = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('Mail:getAll');
          return Restangular.all('lists').getList().then(
            function success(mails) {
              if (successCallback) {
                return successCallback(mails);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:getAll',
                 'Unable to get all mailing lists',
                ].join('\n')
              );
            }
          );
        },
        get: function(mailId, successCallback) {
          $log.debug('Mail:get');
          return Restangular.one('lists', mailId).get().then(
            function success(mail) {
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:get',
                 'Unable to get mailing list',
                 mailId
                ].join('\n')
              );
            }
          );
        },
        update: function(mail, successCallback) {
          $log.debug('Mail:update');
          return mail.put().then(
            function success(mail) {
              Notification.addSuccess('P_Users-Mails_ListUpdateSuccess');
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:update',
                 'Unable to update mailing list',
                ].join('\n')
              );
              $log.error(mail);
            }
          );
        },
        remove: function(mail, successCallback) {
          $log.debug('Mail:remove');
          return mail.remove().then(
            function success(mail) {
              Notification.addSuccess('P_Users-Mails_ListDeleteSuccess');
              if (successCallback) {
                return successCallback(mail);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:remove',
                 'Unable to remove mailing list',
                ].join('\n')
              );
              $log.error(mail);
            }
          );
        },
        addContact: function(mailId, contact, successCallback) {
          $log.debug('Mail:addContact');
          return Restangular.one('lists', mailId).all('contacts').customPOST(contact).then(
            function success(contact) {
              if (successCallback) {
                return successCallback(contact);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:addContact',
                 'Unable to add contact',
                 mailId
                ].join('\n')
              );
              $log.error(contact);
            }
          );
        },
        removeContact: function(mailId, contact, successCallback) {
          $log.debug('Mail:removeContact');
          return Restangular.one('lists', mailId).all('contacts').customOperation('remove', '', {}, {}, contact).then(
            function success(contact) {
              if (successCallback) {
                return successCallback(contact);
              }
            },
            function error() {
              $log.error(
                [
                 'Mail:removeContact',
                 'Unable to remove contact in',
                 mailId
                ].join('\n')
              );
              $log.error(contact);
            }
          );
        },
        setCurrent: function(mail) {
          $log.debug('Mail:setCurrent');
          self.currentMail = mail;
        },
        getCurrent: function() {
          return self.currentMail;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMail);
        }
      };
    }
  ]
);
