'use strict';

angular.module('linshareAdminApp')
  .factory('LdapConnection', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentLdapConnection = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('LdapConnection:getAll');
          return Restangular.all('ldap_connections').getList().then(
            function success(ldapConnections) {
              if (successCallback) {
                return successCallback(ldapConnections);
              }
            },
            function error() {
              $log.error(
                [
                 'LdapConnection:getAll',
                 'Unable to get all ldap connections',
                ].join('\n')
              );
            }
          );
        },
        add: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:add');
          return Restangular.all('ldap_connections').post(ldapConnection).then(
            function success(ldapConnection) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(ldapConnection);
              }
            },
            function error() {
              $log.error(
                [
                 'LdapConnection:add',
                 'Unable to create a ldap connection',
                ].join('\n')
              );
              $log.error(ldapConnection);
            }
          );
        },
        update: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:update');
          return ldapConnection.put().then(
            function success(ldapConnection) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(ldapConnection);
              }
            },
            function error() {
              $log.error(
                [
                 'LdapConnection:update',
                 'Unable to update ldap connection',
                ].join('\n')
              );
              $log.error(ldapConnection);
            }
          );
        },
        remove: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:remove');
          return ldapConnection.remove().then(
            function success(ldapConnection) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(ldapConnection);
              }
            },
            function error() {
              $log.error(
                [
                 'LdapConnection:remove',
                 'Unable to remove ldap connection',
                ].join('\n')
              );
              $log.error(ldapConnection);
            }
          );
        },
        setCurrent: function(ldapConnection) {
          $log.debug('LdapConnection:setCurrent');
          self.currentLdapConnection = ldapConnection;
        },
        getCurrent: function() {
          return self.currentLdapConnection;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentLdapConnection);
        }
      };
    }
  ]
);
