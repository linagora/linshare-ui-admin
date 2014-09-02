'use strict';

angular.module('linshareAdminApp')
  .factory('Domain',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
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
        getDomainTree: function(domainId, successCallback) {
          $log.debug('Domain:getDomainTree');
          return Restangular.all('domains').one(domainId).get({tree: true}).then(
            function success(rootDomain) {
              restangularizeTree(rootDomain, 'domains');
              if (successCallback) {
                return successCallback(rootDomain);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:getDomainTree',
                 'Unable to get domain tree',
                ].join('\n')
              );
            }
          );
        },
        getAll: function(successCallback) {
          $log.debug('Domain:getAll');
          return Restangular.all('domains').getList().then(
            function success(domains) {
              if (successCallback) {
                return successCallback(domains);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:getAll',
                 'Unable to get all domains',
                ].join('\n')
              );
            }
          );
        },
        get: function(id, successCallback) {
          $log.debug('Domain:get');
          return Restangular.one('domains', id).get({tree: true}).then(
            function success(domain) {
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:get',
                 'Unable to get domain',
                 id
                ].join('\n')
              );
            }
          );
        },
        add: function(domain, successCallback) {
          $log.debug('Domain:add');
          return Restangular.all('domains').post(domain).then(
            function success(domain) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:add',
                 'Unable to create a domain',
                ].join('\n')
              );
              $log.error(domain);
            }
          );
        },
        update: function(domain, successCallback, notify) {
          $log.debug('Domain:update');
          notify = typeof notify !== 'undefined' ? notify : true;
          delete domain.children;
          return domain.put().then(
            function success(domain) {
              if (notify) {
                Notification.addSuccess('UPDATE');
              }
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:update',
                 'Unable to update a domain',
                ].join('\n')
              );
              $log.error(domain);
            }
          );
        },
        remove: function(domain, successCallback) {
          $log.debug('Domain:remove');
          return domain.remove().then(
            function success(domain) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error() {
              $log.error(
                [
                 'Domain:remove',
                 'Unable to remove domain',
                ].join('\n')
              );
              $log.error(domain);
            }
          );
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
        },
      };
    }
  ]
);
