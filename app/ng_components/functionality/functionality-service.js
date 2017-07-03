'use strict';

angular.module('linshareAdminApp')
  .factory('Functionality',
    ['$log', 'Restangular',
    function($log, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, identifier) {
          $log.debug('Functionality:getAll');
          return Restangular.all('functionalities').getList({domainId: domainId, parentId: identifier});
        },
        get: function(domainId, funcId) {
          $log.debug('Functionality:get');
          return Restangular.one('functionalities', funcId).get({domainId: domainId});
        },
        update: function(functionality) {
          $log.debug('Functionality:update');
          return functionality.put();
        },
        remove: function(functionality) {
          $log.debug('Functionality:remove');
          return functionality.remove();
        }
      };
    }
  ]
);
