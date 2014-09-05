'use strict';

angular.module('linshareAdminApp')
  .factory('TechnicalAccount', ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('TechnicalAccount:getAll');
          return Restangular.all('technical_accounts').getList().then(
            function success(accounts) {
              if (successCallback) {
                return successCallback(accounts);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:getAll',
                 'Unable to get all accounts',
                ].join('\n')
              );
            }
          );
        },
        get: function(id, successCallback) {
          $log.debug('TechnicalAccount:get');
          return Restangular.one('technical_accounts', id).get().then(
            function success(accounts) {
              if (successCallback) {
                return successCallback(accounts);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:get',
                 'Unable to get a account',
                ].join('\n')
              );
            }
          );
        },
        add: function(account, successCallback) {
          $log.debug('TechnicalAccount:add');
          return Restangular.all('technical_accounts').post(account).then(
            function success(account) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(account);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:add',
                 'Unable to create an account',
                ].join('\n')
              );
              $log.error(account);
            }
          );
        },
        update: function(account, successCallback) {
          $log.debug('TechnicalAccount:update');
          return account.put().then(
            function success(account) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(account);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:update',
                 'Unable to update an account',
                ].join('\n')
              );
              $log.error(account);
            }
          );
        },
        changePassword: function(accountId, password, successCallback) {
          $log.debug('TechnicalAccount:changePassword');
          return Restangular.all('technical_accounts').all(accountId).all('change_password').post(password).then(
            function success(account) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(account);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:changePassword',
                 'Unable to change technical account password',
                 accountId,
                 password,
                ].join('\n')
              );
            }
          );
        },
        remove: function(account, successCallback) {
          $log.debug('TechnicalAccount:remove');
          return account.remove().then(
            function success(account) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(account);
              }
            },
            function error() {
              $log.error(
                [
                 'TechnicalAccount:remove',
                 'Unable to remove an account',
                ].join('\n')
              );
              $log.error(account);
            }
          );
        },
      };
    }
  ]
);
