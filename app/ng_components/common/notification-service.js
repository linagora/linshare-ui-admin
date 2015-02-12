'use strict';

/* Services */

angular.module('linshareAdminApp')
  .factory('Notification', ['$rootScope', '$timeout', '$log', 'lsAppConfig',
  function($rootScope, $timeout, $log, lsAppConfig) {
    return {
      addSuccess: function(action) {
        $log.debug('Notification:addSuccess');
        var newAlert = {};
        newAlert.type = 'success';
        newAlert.msg = 'COMMON.NOTIFICATION.SUCCESS.' + action;
        $rootScope.$broadcast('pushAlert', newAlert);
      },
      addError: function(newAlert) {
        $log.debug('Notification:addError');
        newAlert.date = new Date();
        if (newAlert.status !== undefined && newAlert.status >= 500 && newAlert.status < 600){
          newAlert.type = 'danger';
          newAlert.errorType = 500;
          newAlert.url = lsAppConfig.backendURL;
          newAlert.msg = 'COMMON.NOTIFICATION.ERROR.' + newAlert.status;
          $rootScope.$broadcast('pushAlert', newAlert);
        }
        else {
          newAlert.type = 'danger';
          newAlert.msg = 'COMMON.NOTIFICATION.ERROR.' + newAlert.errCode;
          $rootScope.$broadcast('pushAlert', newAlert);
        }
      },
      getNotification: function(action){
        var notif = true;
        if ('notification' in action && !action.notification)
          {
            notif = false;
            delete action.notification;
          }
        return notif;
      }
    };
  }
]);
