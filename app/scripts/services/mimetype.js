'use strict';

angular.module('linshareAdminApp')
  .factory('MimeType',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      // Public API here
      return {
        update: function(mimeType, successCallback) {
          $log.debug('MimeType:update');
          return Restangular.all('mime_types').customPUT(mimeType).then(
            function success(mimeType) {
              if (successCallback) {
                return successCallback(mimeType);
              }
            },
            function error() {
              $log.error(
                [
                 'MimeType:update',
                 'Unable to update mime type',
                 mimeType.uuid
                ].join('\n')
              );
              $log.error(mimeType);
            }
          );
        }
      };
    }
  ]
);
