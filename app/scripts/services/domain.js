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
            }
          ,
            function error() {
              $log.error(
                [
                 'Domain:getDomainTree',
                 'Unable to get domain tree'
                ].join('\n')
              );
            }
          );
        },
        setCurrentDomain: function(domain) {
          if(angular.isDefined(domain)) {
            this.currentDomain = domain;
          } else {
            $log.error(
              [
               'Domain:setCurrentDomain',
               'Try to set invalid domain'
              ].join('\n')
            );
          }
        },
        getCurrentDomain: function() {
          if(angular.isDefined(this.currentDomain)) {
            this.currentDomain = domain;
          } else {
            $log.error(
              [
               'Domain:setCurrentDomain',
               'Try to get undefined domain'
              ].join('\n')
            );
          }
        }
      };
    }
  ]
);
