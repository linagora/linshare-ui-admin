'use strict';

angular.module('myApp.services')
  .factory('DomainPolicy', ['$log', 'Restangular',
    function ($log, Restangular) {
      this.currentDomainPolicy = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('DomainPolicy:getAll');
          return Restangular.all('domain_policies').getList().then(
            function success(domainPolicies) {
              if (successCallback) {
                return successCallback(domainPolicies);
              }
            },
            function error(response) {
              $log.error(
                [
                 'DomainPolicy:getAll',
                 'Unable to get all domain policies',
                ].join('\n')
              );
            }
          );
        },
        setCurrent: function(domainPolicy) {
          $log.debug('DomainPolicy:setCurrent');
          self.currentDomainPolicy = domainPolicy;
        },
        getCurrent: function() {
          return self.currentDomainPolicy;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentDomainPolicy);
        }
      };
    }
  ]
);
