'use strict';

angular.module('linshareAdminApp')
  .factory('Audit', ['$log', 'Restangular',
    function($log, Restangular) {
      // var self = this;

      // Public API here
      return {
        query: function(criteria) {
          $log.debug('Audit:query');
          return Restangular.all('logs').post(criteria);
        }
      };
    }
  ]
);