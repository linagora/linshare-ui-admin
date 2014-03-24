'use strict';

/* Services */

angular.module('myApp.services')
  .factory('Notification', ['$rootScope', '$timeout', 'localize',
  function($rootScope, $timeout, localize) {
    return {
      addSuccess: function(unLocalizeMsg) {
        var newAlert = {type: 'success', msg: localize.getLocalizedString(unLocalizeMsg)};
        $rootScope.$broadcast('pushAlert', newAlert);
      },
      addError: function(newAlert) {
        newAlert.type = 'error';
        newAlert.msg = localize.getLocalizedString('G_Err_' + newAlert.errCode);
        $rootScope.$broadcast('pushAlert', newAlert);
      }
    };
  }
]);
