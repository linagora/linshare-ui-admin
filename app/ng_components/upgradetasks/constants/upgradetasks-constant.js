/**
 * upgradeTasksConstants Constant
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .constant('upgradeTasksConstants', {
      criticality: {
        MANDATORY: {
          value: 'MANDATORY',
          order: 10
        },
        REQUIRED: {
          value: 'REQUIRED',
          order: 5
        },
        OPTIONAL: {
          value: 'OPTIONAL',
          order: -1
        }
      },
      log: {
        DEBUG: 'DEBUG',
        ERROR: 'ERROR',
        INFO: 'INFO',
        WARNING: 'WARNING'
      },
      status: {
        NEW: 'NEW',
        PENDING: 'PENDING',
        PROCESSING: 'PROCESSING',
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED'
      }
    });
})();
