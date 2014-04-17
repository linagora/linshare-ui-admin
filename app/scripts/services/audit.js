'use strict';

angular.module('linshareUiAdmin')
  .factory('Audit', ['$log', 'Restangular',
    function ($log, Restangular) {
      // var self = this;

      // Public API here
      return {
        getAllActions: function(successCallback) {
          $log.debug('Audit:getAllActions');
          return Restangular.all('logs').all('actions').getList().then(
            function success(actions) {
              if (successCallback) {
                return successCallback(actions);
              }
            },
            function error() {
              $log.error(
                [
                 'Audit:getAllActions',
                 'Unable to get all log actions',
                ].join('\n')
              );
            }
          );
        },
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
