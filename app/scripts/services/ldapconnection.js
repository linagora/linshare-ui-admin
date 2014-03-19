'use strict';

angular.module('myApp.services')
  .factory('LdapConnection', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentLdapConnection = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('LdapConnection:getAll');
          Restangular.all('ldap_connections').getList().then(
            function success(ldapConnections) {
              successCallback(ldapConnections)
            },
            function error(response) {
              $log.error(
                [
                 'LdapConnection:getAll',
                 'Unable to get all ldap connections',
                 response
                ].join('\n')
              );
            }
          );
        },
        add: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:add');
          Restangular.all('ldap_connections').post(ldapConnection).then(
            function success(ldapConnection) {
              Notification.addSuccess('P_Domains-LDAPConnections_CreateSuccess');
              if (successCallback) {
                successCallback(ldapConnection);
              }
            },
            function error(response) {
              $log.error(
                [
                 'LdapConnection:add',
                 'Unable to create a ldap connection',
                 ldapConnection,
                 response
                ].join('\n')
              );
            }
          );
        },
        update: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:update');
          ldapConnection.put().then(
            function success(ldapConnection) {
              Notification.addSuccess('P_Domains-LDAPConnections_UpdateSuccess');
              if (successCallback) {
                successCallback(ldapConnection);
              }
            },
            function error(response) {
              $log.error(
                [
                 'LdapConnection:update',
                 'Unable to update ldap connection',
                 ldapConnection,
                 response
                ].join('\n')
              );
            }
          );
        },
        remove: function(ldapConnection, successCallback) {
          $log.debug('LdapConnection:remove');
          ldapConnection.remove().then(
            function success(ldapConnection) {
              Notification.addSuccess('P_Domains-LDAPConnections_DeleteSuccess');
              if (successCallback) {
                successCallback(ldapConnection);
              }
            },
            function error(response) {
              $log.error(
                [
                 'LdapConnection:remove',
                 'Unable to remove ldap connection',
                 ldapConnection,
                 response
                ].join('\n')
              );
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
