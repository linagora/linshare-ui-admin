'use strict';

angular.module('linshareAdminApp')
  .factory('DomainPolicy', ['$rootScope', '$log', 'Restangular', 'Notification', '$q',
    function ($rootScope, $log, Restangular, Notification, $q) {
      //var self = this;
      var deferred = $q.defer();

      // Public API here
      return {
        getAll: function() {
          $log.debug('DomainPolicy:getAll');
          return Restangular.all('domain_policies').getList();
        },
        get: function(id) {
          $log.debug('DomainPolicy:get');
          if (angular.isObject(id))
          {
            return Restangular.one('domain_policies', id.id).get().then(
              function(success){
                return success;
              },
              function(data){
                return data.status;
              }
            );
          }
          else
            return Restangular.one('domain_policies', id).get();
        },
        add: function(domainPolicy) {
          $log.debug('DomainPolicy:add');
          var notification = Notification.getNotification(domainPolicy);
          Restangular.all('domain_policies').post(domainPolicy).then(function(policy) {
            if (notification == true)
              Notification.addSuccess('CREATE');
            deferred.resolve(policy.plain());
          });
          return deferred.promise;
        },
        update: function(domainPolicy) {
          $log.debug('DomainPolicy:update');
          var notification = Notification.getNotification(domainPolicy);
          return domainPolicy.put().then(function() {
            if (notification == true)
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
