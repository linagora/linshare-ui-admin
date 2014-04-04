'use strict';

angular.module('myApp.services')
  .factory('Domain',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentDomain = undefined;
      this.state = undefined;
      this.lastAccess = undefined;

      function createSample(_parent, _type) {
        var sample = {};
        sample.parent = _parent.identifier;
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
      function restangularizeTree(domain, rootDomain) {
        Restangular.restangularizeElement(null, domain, rootDomain.route);
        if (!_.isEmpty(domain.children)) {
          angular.forEach(domain.children, function(child) {
            restangularizeTree(child, rootDomain);
          });
        }
      }

      // Public API here
      return {
        getDomainTree: function(successCallback) {
          $log.debug('Domain:getDomainTree');
          return Restangular.all('domains').get('LinShareRootDomain').then(
            function success(rootDomain) {
              restangularizeTree(rootDomain, rootDomain);
              return successCallback(rootDomain);
            },
            function error(response) {
              $log.error(
                [
                 'Domain:getDomainTree',
                 'Unable to get domain tree',
                ].join('\n')
              );
            }
          );
        },
        add: function(domain, successCallback) {
          $log.debug('Domain:add');
          return Restangular.all('domains').post(domain).then(
            function success(domain) {
              Notification.addSuccess('P_Domains-Management_CreateSuccess');
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error(response) {
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
        update: function(domain, successCallback) {
          $log.debug('Domain:update');
          delete domain.children;
          return domain.put().then(
            function success(domain) {
              Notification.addSuccess('P_Domains-Management_UpdateSuccess');
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error(response) {
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
              Notification.addSuccess('P_Domains-Management_DeleteSuccess');
              if (successCallback) {
                return successCallback(domain);
              }
            },
            function error(response) {
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
        setCurrentTopDomainSample: function(rootDomain) {
          $log.debug('Domain:setCurrentTopDomainSample');
          self.state = 'create';
          self.currentDomain = createSample(rootDomain, 'TOPDOMAIN');
        },
        setCurrentSubDomainSample: function(topDomain) {
          $log.debug('Domain:setCurrentSubDomainSample');
          self.state = 'create';
          self.currentDomain = createSample(topDomain, 'SUBDOMAIN');
        },
        setCurrentGuestDomainSample: function(topDomain) {
          $log.debug('Domain:setCurrentGuestDomainSample');
          self.state = 'create';
          self.currentDomain = createSample(topDomain, 'GUESTDOMAIN');
        },
        setCurrent: function(domain) {
          $log.debug('Domain:setCurrent');
          self.state = 'edit';
          self.lastAccess = Date.now();
          self.currentDomain = domain;
        },
        getLastAccess: function() {
          return self.lastAccess;
        },
        getCurrent: function() {
          return self.currentDomain;
        },
        getState: function() {
          return self.state;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentDomain);
        }
      };
    }
  ]
);
