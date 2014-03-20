'use strict';

angular.module('myApp.services')
  .factory('Functionality',
    ['$log', 'Notification', 'Restangular', 'localize',
    function ($log, Notification, Restangular, localize) {
      this.currentFunctionality = undefined;

      var getLocalizedName = function(functionality) {
        return localize.getLocalizedString(
          'P_Administration-Functionalities_Func-' + functionality.identifier
        );
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
                  functionality.localizedName = getLocalizedName(functionality);
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
