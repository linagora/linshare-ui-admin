'use strict';

angular.module('linshareAdminApp')
  .factory('UploadPropositionFilter', ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentFilter = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('UploadPropositionFilter:getAll');
          return Restangular.all('upload_proposition_filters').getList().then(
            function success(filters) {
              if (successCallback) {
                return successCallback(filters);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadPropositionFilter:getAll',
                 'Unable to get all upload proposition filters',
                ].join('\n')
              );
            }
          );
        },
        add: function(filter, successCallback) {
          $log.debug('UploadPropositionFilter:add');
          return Restangular.all('upload_proposition_filters').post(filter).then(
            function success(filter) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(filter);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadPropositionFilter:add',
                 'Unable to create an upload proposition filter',
                ].join('\n')
              );
              $log.error(filter);
            }
          );
        },
        update: function(filter, successCallback, notify) {
          $log.debug('UploadPropositionFilter:update');
          notify = typeof notify !== 'undefined' ? notify : true;
          return filter.put().then(
            function success(filter) {
              if (notify) {
                Notification.addSuccess('UPDATE');
              }
              if (successCallback) {
                return successCallback(filter);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadPropositionFilter:update',
                 'Unable to update an upload proposition filter',
                ].join('\n')
              );
              $log.error(filter);
            }
          );
        },
        remove: function(filter, successCallback) {
          $log.debug('UploadPropositionFilter:remove');
          return filter.remove().then(
            function success(filter) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(filter);
              }
            },
            function error() {
              $log.error(
                [
                 'UploadPropositionFilter:remove',
                 'Unable to remove upload proposition filter',
                ].join('\n')
              );
              $log.error(filter);
            }
          );
        },
        setCurrent: function(filter) {
          $log.debug('UploadPropositionFilter:setCurrent');
          self.currentFilter = filter;
        },
        getCurrent: function() {
          return self.currentFilter;
        },
        copyCurrent: function() {
          return Restangular.copy(self.currentFilter);
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentFilter);
        }
      };
    }
  ]
);
