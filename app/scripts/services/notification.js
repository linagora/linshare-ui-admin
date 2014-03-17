'use strict';

/* Services */

angular.module('myApp.services')
  .factory('Notification', ['$rootScope', '$timeout', 'localize',
  function($rootScope, $timeout, Localize) {
    return {
      addSuccess: function(unLocalizeMsg) {
        var newAlert = {type: 'success', msg: Localize.getLocalizedString(unLocalizeMsg)};
        $rootScope.$broadcast('pushAlert', newAlert);
      },
      addError: function(newAlert) {
        newAlert.type = 'error';
        newAlert.msg = Localize.getLocalizedString('G_Err_' + newAlert.errCode);
        $rootScope.$broadcast('pushAlert', newAlert);
      }
    };
  }
]);
