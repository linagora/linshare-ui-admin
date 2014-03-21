'use strict';

angular.module('myApp.services')
  .factory('Functionality',
    ['$log', 'Notification', 'Restangular', 'localize',
    function ($log, Notification, Restangular, localize) {
      this.currentFunctionality = undefined;

      var addLocalizedName = function(functionality) {
        functionality.localizedName = localize.getLocalizedString(
          'P_Administration-Functionalities_Func-' + functionality.identifier
        );
      };

      var deleteLocalizedName = function(functionality) {
        delete functionality.localizedName;
      };

      var self = this;

      // Public API here
      return {
        getAll: function(domain, successCallback) {
          $log.debug('Functionality:getAll');
          Restangular.all('domains').all(domain.identifier)
            .all('functionalities').getList().then(
              function success(functionalities) {
                angular.forEach(functionalities, function (functionality, key) {
                  addLocalizedName(functionality);
                });
                successCallback(functionalities);
              },
              function error(response) {
                $log.error(
                  [
                   'Functionality:getAll',
                   'Unable to get all functionalities for domain',
                   domain.identifier
                  ].join('\n')
                );
                $log.error(domain);
              }
          );
        },
        get: function(domain, functionalityId,successCallback) {
          $log.debug('Functionality:get');
          Restangular.all('domains').all(domain.identifier)
            .one('functionalities', functionalityId).get().then(
              function success(functionality) {
                addLocalizedName(functionality);
                successCallback(functionality);
              },
              function error(response) {
                $log.error(
                  [
                   'Functionality:get',
                   'Unable to get the functionalities',
                   functionalityId,
                   'for domain',
                   domain.identifier
                  ].join('\n')
                );
                $log.error(domain);
              }
          );
        },
        update: function(functionality, successCallback) {
          $log.debug('Functionality:update');
          var rawFunctionality = {};
          rawFunctionality = Restangular.copy(functionality);
          deleteLocalizedName(rawFunctionality);
          rawFunctionality.put().then(
            function success(rawFunctionality) {
              successCallback(functionality);
            },
            function error(response) {
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
          rawFunctionality.remove().then(
            function success(rawFunctionality) {
              successCallback(functionality);
            },
            function error(response) {
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
        currentIsDefined: function() {
          return angular.isDefined(self.currentFunctionality);
        }
      };
    }
  ]
);
