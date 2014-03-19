'use strict';

angular.module('myApp.services')
  .factory('Domain',
    ['$log', 'Notification', 'Restangular',
    function ($log, Motification, Restangular) {
      this.currentDomain = undefined;
      
      function createSample(_parent, _type) {
        var sample = {};
        sample.parent = _parent;
        sample.type = _type;
        sample.providers = [];
        if(_type === 'GUESTDOMAIN') {
          sample.userRole = 'SIMPLE';
        }
        return sample;
      };

      var self = this;

      /**
       * As domains are returned as tree, 
       * we need to put restangular route manually in all domains
       */
      function traverse(domain, rootDomain) {
        domain.route = rootDomain.route;
        if (!_.isEmpty(domain.children)) {
          angular.forEach(domain.children, function(child) {
            traverse(child, rootDomain);
          });
        }
      }

      // Public API here
      return {
        getDomainTree: function(successCallback) {
          $log.debug('Domain:getDomainTree');
          Restangular.all('domains').get('LinShareRootDomain').then(
            function success(rootDomain) {
              traverse(rootDomain, rootDomain);
              successCallback(rootDomain);
            },
            function error(response) {
              $log.error(
                [
                 'Domain:getDomainTree',
                 'Unable to get domain tree',
                 response
                ].join('\n')
              );
            }
          );
        },
        add: function(domain, successCallback) {
          $log.debug('Domain:add');
          Restangular.all('domains').post(domain).then(
            function success(domain) {
              Notification.addSuccess('P_Domains-Management_CreateSuccess');
              if (successCallback) {
                successCallback(domain);
              }
            },
            function error(response) {
              $log.error(
                [
                 'Domain:add',
                 'Unable to create a domain',
                 domain,
                 response
                ].join('\n')
              );
            }
          );
        },
        update: function(domain, successCallback) {
          $log.debug('Domain:update');
          domain.put().then(
            function success(domain) {
              Notification.addSuccess('P_Domains-Management_UpdateSuccess');
              if (successCallback) {
                successCallback(domain);
              }
            },
            function error(response) {
              $log.error(
                [
                 'Domain:update',
                 'Unable to update a domain',
                 domain,
                 response
                ].join('\n')
              );
            }
          );
        },
        remove: function(domain, successCallback) {
          $log.debug('Domain:remove');
          domain.remove().then(
            function success(domain) {
              Notification.addSuccess('P_Domains-Management_DeleteSuccess');
              if (successCallback) {
                successCallback(domain);
              }
            },
            function error(response) {
              $log.error(
                [
                 'Domain:remove',
                 'Unable to remove domain',
                 domain,
                 response
                ].join('\n')
              );
            }
          );
        },
        createTopDomainSample: function(rootDomain) {
          $log.debug('Domain:createTopDomainSample');
          return createSample(rootDomain, 'TOPDOMAIN');
        },
        createSubDomainSample: function(topDomain) {
          $log.debug('Domain:createSubDomainSample');
          return createSample(topDomain, 'SUBDOMAIN');
        },
        createGuestDomainSample: function(topDomain) {
          $log.debug('Domain:createGuestDomainSample');
          return createSample(topDomain, 'GUESTDOMAIN');
        },
        setCurrent: function(domain) {
          $log.debug('Domain:setCurrent');
          self.currentDomain = domain;
        },
        getCurrent: function() {
          return self.currentDomain;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentDomain);
        }
      };
    }
  ]
);
