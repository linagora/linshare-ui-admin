'use strict';

angular.module('myApp.services')
  .factory('DomainPolicy', ['$log', 'Restangular',
    function ($log, Restangular) {

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('DomainPolicy:getAll');
          Restangular.all('domain_policies').getList().then(
            function success(domainPolicies) {
              successCallback(domainPolicies);
            },
            function error(response) {
              $log.error(
                [
                 'DomainPolicy:getAll',
                 'Unable to get all domain policies',
                 response
                ].join('\n')
              );
            }
          );
        }
      };
    }
  ]
);
