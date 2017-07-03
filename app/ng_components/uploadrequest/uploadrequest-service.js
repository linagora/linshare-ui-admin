'use strict';

angular.module('linshareAdminApp')
  .factory('UploadRequest', ['$log', 'Restangular',
    function($log, Restangular) {
      // var self = this;

      // Public API here
      return {
        query: function(criteria) {
          $log.debug('UploadRequest:query');
          return Restangular.all('upload_requests').post(criteria);
        },
        history: function(uploadRequestUuid) {
          $log.debug('UploadRequest:history');
          return Restangular.all('upload_requests').one('history', uploadRequestUuid).getList();
        }
      };
    }
  ]
);
