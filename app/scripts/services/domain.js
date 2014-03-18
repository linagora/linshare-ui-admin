'use strict';

angular.module('myApp.services')
  .factory('Domain', ['$log', 'Restangular',
    function ($log, Restangular) {
      this.currentDomain = undefined;

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
        setCurrent: function(domain) {
          $log.debug('Domain:setCurrent');
          this.currentDomain = domain;
        },
        getCurrent: function() {
          $log.debug('Domain:getCurrent');
          return this.currentDomain;
        }
      };
    }
  ]
);
