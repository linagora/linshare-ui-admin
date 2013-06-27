'use strict';

/* Services */

angular.module('myApp.services')
  .factory('preferencesService', ['$cookies', 'loggerService',
  function($cookies, logger) {
    var Preferences = {
      system: {},

      load: function() {
        var url = '/system-preferences.json';
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
          console.error('No system preferences file');
        }
        Preferences.system = JSON.parse(request.responseText);

        var defaultLoggerLevel = 2;
        if (!angular.isDefined($cookies.linshare_loggerLevel)) {
          if (!angular.isDefined(Preferences.system.loggerLevel)) {
            logger.currentLevel = defaultLoggerLevel;
          } else {
            logger.currentLevel = Preferences.system.loggerLevel;
          }
          $cookies.linshare_loggerLevel = logger.currentLevel;
        } else {
          logger.currentLevel = $cookies.linshare_loggerLevel;
        }
      }
    };
    return Preferences;
  }
]);
