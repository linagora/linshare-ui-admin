'use strict';

angular.module('linshareAdminApp')
  .factory('Functionality',
    ['$log', '$translate', 'Notification', 'Restangular',
    function ($log, $translate, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, successCallback) {
          $log.debug('Functionality:getAll');
          return Restangular.all('functionalities')
            .getList({domainId: domainId}).then(
              function success(functionalities) {
                if (successCallback) {
                  return successCallback(functionalities);
                }
              },
              function error() {
                $log.error(
                  [
                   'Functionality:getAll',
                   'Unable to get all functionalities for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        get: function(domainId, funcId, successCallback) {
          $log.debug('Functionality:get');
          return Restangular.one('functionalities', funcId)
            .get({domainId: domainId}).then(
              function success(functionality) {
                if (successCallback) {
                  return successCallback(functionality);
                }
              },
              function error() {
                $log.error(
                  [
                   'Functionality:get',
                   'Unable to get the functionalities',
                   funcId,
                   'for domain',
                   domainId
                  ].join('\n')
                );
              }
          );
        },
        update: function(functionality, successCallback) {
          $log.debug('Functionality:update');
          return functionality.put().then(
            function success(functionality) {
              if (successCallback) {
                return successCallback(functionality);
              }
            },
            function error() {
              $log.error(
                [
                 'Functionality:update',
                 'Unable to update functionality',
                 functionality.identifier
                ].join('\n')
              );
              $log.error(functionality);
            }
          );
        },
        remove: function(functionality, successCallback) {
          $log.debug('Functionality:remove');
          return functionality.remove().then(
            function success() {
              if (successCallback) {
                return successCallback(functionality);
              }
            },
            function error() {
              $log.error(
                [
                 'Functionality:remove',
                 'Unable to remove functionality',
                 functionality.identifier
                ].join('\n')
              );
              $log.error(functionality);
            }
          );
        },
      };
    }
  ]
);
