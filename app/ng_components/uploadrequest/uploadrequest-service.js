'use strict';

angular.module('linshareAdminApp')
  .factory('UploadRequest', ['$log', 'Restangular',
    function ($log, Restangular) {
      // var self = this;

      // Public API here
      return {
        query: function(criteria, successCallback) {
          $log.debug('UploadRequest:query');
          return Restangular.all('upload_requests').post(criteria).then(
            function success(results) {
              if (successCallback) {
                return successCallback(results);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadRequest:query',
                 'Unable to query',
                ].join('\n')
              );
              $log.error(criteria);
            }
          );
        },
        history: function(uploadRequestUuid, successCallback) {
          $log.debug('UploadRequest:history');
          return Restangular.all('upload_requests').one('history', uploadRequestUuid).getList().then(
            function success(results) {
              if (successCallback) {
                return successCallback(results);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadRequest:history',
                 'Unable to query',
                ].join('\n')
              );
              $log.error(uploadRequestUuid);
            }
          );
        }
      };
    }
  ]
);
