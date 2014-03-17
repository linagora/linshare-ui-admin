'use strict';

angular.module('myApp.services')
  .factory('DomainPattern', ['$log', 'Restangular',
    function ($log, Restangular) {
      this.currentDomainPattern = undefined;

      // Public API here
      return {
        getAllDomainPatterns: function(successCallback) {
          $log.debug('DomainPattern:getAllDomainPatterns');
          Restangular.all('domain_patterns').getList().then(
            function success(domainPatterns) {
              successCallback(domainPatterns);
            }
          ,
            function error() {
              $log.error(
                [
                 'DomainPattern:getAllDomainPatterns',
                 'Unable to get all domain patterns'
                ].join('\n')
              );
            }
          );
        },
        setCurrentDomainPattern: function(domainPattern) {
          if(angular.isDefined(domainPattern)) {
            this.currentDomainPattern = domainPattern;
          } else {
            $log.error(
              [
               'DomainPattern:setCurrentDomainPattern',
               'Try to set invalid domain pattern'
              ].join('\n')
            );
          }
        },
        getCurrentDomainPattern: function() {
          if(angular.isDefined(this.currentDomainPattern)) {
            this.currentDomainPattern = domainPattern;
          } else {
            $log.error(
              [
               'DomainPattern:getCurrentDomainPattern',
               'Try to get undefined domain pattern'
              ].join('\n')
            );
          }
        }
      };
    }
  ]
);
