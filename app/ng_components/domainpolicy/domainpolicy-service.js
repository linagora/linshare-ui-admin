'use strict';

angular.module('linshareAdminApp')
  .factory('DomainPolicy', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('DomainPolicy:getAll');
          return Restangular.all('domain_policies').getList();
        },
        get: function(id) {
          $log.debug('DomainPolicy:get');
          return Restangular.one('domain_policies', id).get();
        },
        add: function(domainPolicy) {
          $log.debug('DomainPolicy:add');
          return Restangular.all('domain_policies').post(domainPolicy).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(domainPolicy) {
          $log.debug('DomainPolicy:update');
          return domainPolicy.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        exist: function(domainIdentifier) {
          $log.debug('DomainPolicy:head');
          return Restangular.one('domain_policies', domainIdentifier).head();
        },
        remove: function(domainPolicy) {
          $log.debug('DomainPolicy:remove');
          return domainPolicy.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
