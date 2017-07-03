'use strict';

angular.module('linshareAdminApp')
  .factory('MimeType',
    ['$log', 'Notification', 'Restangular',
    function($log, Notification, Restangular) {
      // Public API here
      return {
        update: function(mimeType) {
          $log.debug('MimeType:update');
          return Restangular.all('mime_types').customPUT(mimeType);
        }
      };
    }
  ]
);
