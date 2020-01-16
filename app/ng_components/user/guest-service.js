'use strict';

angular.module('linshareAdminApp')
  .factory('Guest', ['$log', 'Restangular',
    function($log, Restangular) {

      return {
        get: function(uuid) {
          $log.debug('Guest:get');
          return Restangular.one('guests', uuid).get();
        }
      };
    }
  ]
);
