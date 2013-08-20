'use strict';

/* Services */

angular.module('myApp.services')
  .factory('alertService', ['$rootScope',
  function($rootScope) {
    var Alert = {
      addSuccess: function(newAlert, message) {
        newAlert.severity = 'success';
        $rootScope.$broadcast('pushAlertSuccess', newAlert, message);
      },
      addError: function(newAlert) {
        newAlert.severity = 'error';
        $rootScope.$broadcast('pushAlertError', newAlert);
      }
    };
    return Alert;
  }
]);
