'use strict';

angular.module('linshareAdminApp')
  .service('Enum', ['$log', 'Restangular', function Enum($log, Restangular) {
    // var self = this;

    return {
      getOptions: function(name) {
        $log.debug('Enum:getOptions:' + name);
        return Restangular.all('enums').all(name).options();
      }
    };
  }]);
