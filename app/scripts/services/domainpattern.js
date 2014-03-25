'use strict';

angular.module('myApp.services')
  .factory('DomainPattern', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      this.currentDomainPattern = undefined;

      function unRestangularizeElement(obj) {
        if(obj) {
          delete obj.route;
          delete obj.parentResource;
          delete obj.restangularCollection;
        }
      };

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('DomainPattern:getAll');
          Restangular.all('domain_patterns').getList().then(
            function success(domainPatterns) {
              if (successCallback) {
                successCallback(domainPatterns);
              }
            },
            function error(response) {
              $log.error(
                [
                 'DomainPattern:getAll',
                 'Unable to get all domain patterns',
                ].join('\n')
              );
            }
          );
        },
        add: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:add');
          Restangular.all('domain_patterns').post(domainPattern).then(
            function success(domainPattern) {
              Notification.addSuccess('P_Domains-DomainPatterns_CreateSuccess');
              if (successCallback) {
                successCallback(domainPattern);
              }
            },
            function error(response) {
              $log.error(
                [
                 'DomainPattern:add',
                 'Unable to create a domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        update: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:update');
          domainPattern.put().then(
            function success(domainPattern) {
              Notification.addSuccess('P_Domains-DomainPatterns_UpdateSuccess');
              if (successCallback) {
                successCallback(domainPattern);
              }
            },
            function error(response) {
              $log.error(
                [
                 'DomainPattern:update',
                 'Unable to update domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        remove: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:remove');
          domainPattern.remove().then(
            function success(domainPattern) {
              Notification.addSuccess('P_Domains-DomainPatterns_DeleteSuccess');
              if (successCallback) {
                successCallback(domainPattern);
              }
            },
            function error(response) {
              $log.error(
                [
                 'DomainPattern:remove',
                 'Unable to remove domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        getAllModels: function(successCallback) {
          $log.debug('DomainPattern:getAllModels');
          Restangular.all('domain_patterns').all('models').getList().then(
            function success(models) {
              if (successCallback) {
                successCallback(models);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:remove',
                 'Unable to get all domain pattern model',
                ].join('\n')
              );
            });
        },
        setCurrent: function(domainPattern) {
          $log.debug('DomainPattern:setCurrent');
          self.currentDomainPattern = domainPattern;
        },
        getCurrent: function() {
          return self.currentDomainPattern;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentDomainPattern);
        }
      };
    }
  ]
);
