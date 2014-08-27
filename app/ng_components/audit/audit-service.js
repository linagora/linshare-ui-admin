'use strict';

angular.module('linshareAdminApp')
  .factory('Audit', ['$log', 'Restangular',
    function ($log, Restangular) {
      // var self = this;

      // Public API here
      return {
        query: function(criteria, successCallback) {
          $log.debug('Audit:query');
          return Restangular.all('logs').post(criteria).then(
            function success(results) {
              if (successCallback) {
                return successCallback(results);
              }
            },
            function error() {
              $log.error(
                [
                 'Audit:query',
                 'Unable to query',
                ].join('\n')
              );
              $log.error(criteria);
            }
          );
        }
      };
    }
  ]
);
