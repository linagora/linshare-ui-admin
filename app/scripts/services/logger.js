'use strict';

/* Services */

angular.module('myApp.services')
  .factory('loggerService', ['$log',
  function($log) {
    var levels = {
      'TRACE': 0,
      'DEBUG': 1,
      'INFO': 2,
      'WARN': 3,
      'ERROR': 4,
      'SILENT': 5
    };

    var logger = {
      currentLevel: 0,

      checkLevels: function(type) {
        return logger.currentLevel <= levels[type];
      },

      trace: function(msg) {
        if (logger.checkLevels('TRACE')) {
          console.trace(msg);
        }
      },

      debug: function(msg) {
        if (logger.checkLevels('DEBUG')) {
          console.debug(msg);
        }
      },

      info: function(msg) {
        if (logger.checkLevels('DEBUG')) {
          $log.info(msg);
        }
      },

      warn: function(msg) {
        if (logger.checkLevels('WARN')) {
          $log.warn(msg);
        }
      },

      error: function(msg) {
        if (logger.checkLevels('ERROR')) {
          $log.error(msg);
        }
      }
    };
    return logger;
  }
]);
