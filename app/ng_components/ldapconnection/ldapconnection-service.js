'use strict';

angular.module('linshareAdminApp')
  .factory('LdapConnection', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('LdapConnection:getAll');
          return Restangular.all('ldap_connections').getList();
        },
        get: function(id) {
          $log.debug('LdapConnection:get');
          return Restangular.one('ldap_connections', id).get();
        },
        add: function(ldapConnection) {
          $log.debug('LdapConnection:add');
          return Restangular.all('ldap_connections').post(ldapConnection).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(ldapConnection) {
          $log.debug('LdapConnection:update');
          return ldapConnection.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(ldapConnection) {
          $log.debug('LdapConnection:remove');
          return ldapConnection.remove().then(function() {
              Notification.addSuccess('DELETE');
          });
        },
      };
    }
  ]
);
