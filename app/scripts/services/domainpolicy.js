'use strict';

angular.module('myApp.services')
  .factory('DomainPolicy', ['$log', 'Restangular',
    function ($log, Restangular) {

      // Public API here
      return {
        getAllDomainPolicies: function(successCallback) {
          $log.debug('DomainPolicy:getAllDomainPolicies');
          Restangular.all('domain_policies').getList().then(
            function success(domainPolicies) {
              successCallback(domainPolicies);
            }
          ,
            function error() {
              $log.error(
                [
                 'DomainPolicy:getAllDomainPolicies',
                 'Unable to get all domain policies'
                ].join('\n')
              );
            }
          );
        }
      };
    }
  ]
);
