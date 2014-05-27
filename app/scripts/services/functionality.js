'use strict';

angular.module('linshareAdminApp')
  .factory('Functionality',
    ['$log', '$translate', 'Notification', 'Restangular',
    function ($log, $translate, Notification, Restangular) {
      this.currentFunctionality = undefined;

      var addLocalizedName = function(functionality) {
        $translate('FUNCTIONALITIES.NAME.' + functionality.identifier)
          .then(function(localizedName) {
            functionality.localizedName = localizedName;
          }
        );
        angular.forEach(functionality.functionalities, function(childFunctionality) {
          $translate('FUNCTIONALITIES.NAME.' + childFunctionality.identifier)
            .then(function(localizedName) {
              childFunctionality.localizedName = localizedName;
            }
          );
        });
      };

      var deleteLocalizedName = function(functionality) {
        delete functionality.localizedName;
        angular.forEach(functionality.functionalities, function(childFunctionality) {
          delete childFunctionality.localizedName;
        });
      };

      var self = this;

      // Public API here
      return {
        getAll: function(domainId, successCallback) {
          $log.debug('Functionality:getAll');
          return Restangular.all('functionalities')
            .getList({domainId: domainId}).then(
              function success(functionalities) {
                angular.forEach(functionalities, function (functionality) {
                  addLocalizedName(functionality);
                });
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
                addLocalizedName(functionality);
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
          var rawFunctionality = {};
          rawFunctionality = Restangular.copy(functionality);
          deleteLocalizedName(rawFunctionality);
          return rawFunctionality.put().then(
            function success() {
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
          var rawFunctionality = {};
          rawFunctionality = Restangular.copy(functionality);
          deleteLocalizedName(rawFunctionality);
          return rawFunctionality.remove().then(
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
        setCurrent: function(functionality) {
          $log.debug('Functionality:setCurrent');
          self.currentFunctionality = functionality;
        },
        getCurrent: function() {
          return self.currentFunctionality;
        },
        getId: function(functionality) {
          return functionality.identifier;
        },
        currentIsDefined: function() {
          return angular.isDefined(self.currentFunctionality);
        }
      };
    }
  ]
);
