'use strict';

/* Services */

angular.module('linshareAdminApp')
  .factory('Notification', ['$rootScope', '$timeout', '$log', 'localize',
  function($rootScope, $timeout, $log, localize) {
    return {
      addSuccess: function(unLocalizeMsg) {
        $log.debug('Notification:addSuccess');
        var newAlert = {};
        newAlert.type = 'success';
        newAlert.msg = localize.getLocalizedString(unLocalizeMsg);
        $rootScope.$broadcast('pushAlert', newAlert);
      },
      addError: function(newAlert) {
        $log.debug('Notification:addError');
        newAlert.type = 'danger';
        newAlert.msg = localize.getLocalizedString('G_Err_' + newAlert.errCode);
        $rootScope.$broadcast('pushAlert', newAlert);
      }
    };
  }
]);
