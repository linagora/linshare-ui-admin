'use strict';

angular.module('linshareAdminApp')
  .factory('MimePolicy',
    ['$log', 'Notification', 'Restangular', 'customDeleteService',
    function($log, Notification, Restangular, customDeleteService) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain) {
          $log.debug('MimePolicy:getAll');
          return Restangular.all('mime_policies')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain});
        },
        get: function(mimePolicyId, full) {
          $log.debug('MimePolicy:get');
          return Restangular.one('mime_policies', mimePolicyId).get({full: full});
        },
        add: function(mimePolicy) {
          $log.debug('MimePolicy:add');
          return Restangular.all('mime_policies').post(mimePolicy).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(mimePolicy) {
          $log.debug('MimePolicy:update');
          return mimePolicy.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        enableAllMimeTypes: function(mimePolicyId) {
          $log.debug('MimePolicy:enableAllMimeTypes');
          return Restangular.one('mime_policies', mimePolicyId).customPUT(null, 'enable_all');
        },
        disableAllMimeTypes: function(mimePolicyId) {
          $log.debug('MimePolicy:disableAllMimeTypes');
          return Restangular.one('mime_policies', mimePolicyId).customPUT(null, 'disable_all');
        },
        remove: function(mimePolicy) {
          $log.debug('MimePolicy:remove');
          return customDeleteService.remove('mime_policies', mimePolicy).then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
