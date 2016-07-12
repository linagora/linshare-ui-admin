'use strict';

angular.module('linshareAdminApp')
  .factory('Domain',
    ['$q', '$log', 'Notification', 'Restangular',
    function ($q, $log, Notification, Restangular) {
      // var self = this;

      /**
       * As domains are returned as tree,
       * we need to put restangular route manually in all domains
       */
      function restangularizeTree(domain, route) {
        Restangular.restangularizeElement(null, domain, route);
        if (!_.isEmpty(domain.children)) {
          angular.forEach(domain.children, function(child) {
            restangularizeTree(child, route);
          });
        }
      }

      // Public API here
      return {
        getDomainTree: function(domainId, parent) {
          $log.debug('Domain:getDomainTree');
          parent = parent || false;
          return Restangular.all('domains').one(domainId).get({tree: true, parent: parent}).then(function(rootDomain) {
            restangularizeTree(rootDomain, 'domains');
            var dfd = $q.defer();
            dfd.resolve(rootDomain);
            return dfd.promise;
          });
        },
        getAll: function() {
          $log.debug('Domain:getAll');
          return Restangular.all('domains').getList();
        },
        get: function(id) {
          $log.debug('Domain:get');
          return Restangular.one('domains', id).get({tree: true});
        },
        add: function(domain) {
          $log.debug('Domain:add');
          return Restangular.all('domains').post(domain).then(function(newDomain) {
            var deferred = $q.defer();
            deferred.resolve(newDomain);
            Notification.addSuccess('CREATE');
            return deferred.promise;
          });
        },
        update: function(domain, notify) {
          $log.debug('Domain:update');
          notify = typeof notify !== 'undefined' ? notify : true;
          delete domain.children;
          return domain.put().then(function() {
            if (notify) {
              Notification.addSuccess('UPDATE');
            }
          });
        },
        remove: function(domain) {
          $log.debug('Domain:remove');
          return domain.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        },
        createSample: function (parentId, type) {
          var sample = {};
          sample.parent = parentId;
          sample.type = type;
          sample.providers = [];
          if(type === 'GUESTDOMAIN') {
            sample.userRole = 'SIMPLE';
          }
          return sample;
        },
        getId: function(domain) {
          return domain.identifier;
        }
      };
    }
  ]
);
