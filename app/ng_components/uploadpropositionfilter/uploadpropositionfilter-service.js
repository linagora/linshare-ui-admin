'use strict';

angular.module('linshareAdminApp')
  .factory('UploadPropositionFilter', ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('UploadPropositionFilter:getAll');
          return Restangular.all('upload_proposition_filters').getList();
        },
        get: function(id) {
          $log.debug('UploadPropositionFilter:get');
          return Restangular.one('upload_proposition_filters', id).get();
        },
        add: function(filter) {
          $log.debug('UploadPropositionFilter:add');
          return Restangular.all('upload_proposition_filters').post(filter).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(filter, notify) {
          $log.debug('UploadPropositionFilter:update');
          notify = typeof notify !== 'undefined' ? notify : true;
          return filter.put().then(function() {
            if (notify) {
              Notification.addSuccess('UPDATE');
            }
          });
        },
        remove: function(filter) {
          $log.debug('UploadPropositionFilter:remove');
          return filter.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        },
      };
    }
  ]
);
