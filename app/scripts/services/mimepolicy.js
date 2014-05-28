'use strict';

angular.module('linshareAdminApp')
  .factory('MimePolicy',
    ['$log', 'Notification', 'Restangular',
    function ($log, Notification, Restangular) {
      this.currentMimePolicy = undefined;

      var self = this;

      // Public API here
      return {
        getAll: function(domainId, onlyCurrentDomain, successCallback) {
          $log.debug('MimePolicy:getAll');
          return Restangular.all('mime_policies')
            .getList({domainId: domainId, onlyCurrentDomain: onlyCurrentDomain}).then(
              function success(mimePolicies) {
                if (successCallback) {
                  return successCallback(mimePolicies);
                }
              },
              function error() {
                $log.error(
                  [
                   'MimePolicy:getAll',
                   'Unable to get all mime policies for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        get: function(mimePolicyId, full, successCallback) {
          $log.debug('MimePolicy:get');
          return Restangular.one('mime_policies', mimePolicyId)
            .get({full: full}).then(
              function success(mimePolicy) {
                if (successCallback) {
                  return successCallback(mimePolicy);
                }
              },
              function error() {
                $log.error(
                  [
                   'MimePolicy:get',
                   'Unable to get the mime policy',
                   mimePolicyId
                  ].join('\n')
                );
              }
          );
        },
        add: function(mimePolicy, successCallback) {
          $log.debug('MimePolicy:add');
          return Restangular.all('mime_policies').post(mimePolicy).then(
            function success(mimePolicy) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(mimePolicy);
              }
            },
            function error() {
              $log.error(
                [
                 'MimePolicy:add',
                 'Unable to create a mime policy',
                ].join('\n')
              );
              $log.error(mimePolicy);
            }
          );
        },
        update: function(mimePolicy, successCallback) {
          $log.debug('MimePolicy:update');
          return mimePolicy.put().then(
            function success(mimePolicy) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(mimePolicy);
              }
            },
            function error() {
              $log.error(
                [
                 'MimePolicy:update',
                 'Unable to update mime policy',
                 mimePolicy.uuid
                ].join('\n')
              );
              $log.error(mimePolicy);
            }
          );
        },
        enableAllMimeTypes: function(mimePolicyId, successCallback) {
          $log.debug('MimePolicy:enableAllMimeTypes');
          return Restangular.one('mime_policies', mimePolicyId).customPUT(null, 'enable_all').then(
            function success(mimePolicy) {
              if (successCallback) {
                return successCallback(mimePolicy);
              }
            },
            function error() {
              $log.error(
                [
                 'MimePolicy:enableAllMimeTypes',
                 'Unable to enable all mime types',
                 'of the mime policy :',
                 mimePolicyId
                ].join('\n')
              );
            }
          );
        },
        disableAllMimeTypes: function(mimePolicyId, successCallback) {
          $log.debug('MimePolicy:disableAllMimeTypes');
          return Restangular.one('mime_policies', mimePolicyId).customPUT(null, 'disable_all').then(
            function success(mimePolicy) {
              if (successCallback) {
                return successCallback(mimePolicy);
              }
            },
            function error() {
              $log.error(
                [
                 'MimePolicy:disableAllMimeTypes',
                 'Unable to disable all mime types',
                 'of the mime policy :',
                 mimePolicyId
                ].join('\n')
              );
            }
          );
        },
        remove: function(mimePolicy, successCallback) {
          $log.debug('MimePolicy:remove');
          return mimePolicy.remove().then(
            function success() {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(mimePolicy);
              }
            },
            function error() {
              $log.error(
                [
                 'MimePolicy:remove',
                 'Unable to remove mime policy',
                 mimePolicy.uuid
                ].join('\n')
              );
              $log.error(mimePolicy);
            }
          );
        },
        setCurrent: function(mimePolicy) {
          $log.debug('MimePolicy:setCurrent');
          self.currentMimePolicy = mimePolicy;
        },
        getCurrent: function() {
          return self.currentMimePolicy;
        },
        copyCurrent: function() {
          return Restangular.copy(self.currentMimePolicy);
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentMimePolicy);
        }
      };
    }
  ]
);
