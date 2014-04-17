'use strict';

angular.module('linshareUiAdmin')
  .service('Enum', function Enum($log, Restangular) {
    // var self = this;
    
    return {
      getOptions: function(name, successCallback) {
        $log.debug('Enum:getOptions:' + name);
        return Restangular.all('enums').all(name).options().then(
          function success(options){
            if (successCallback) {
              successCallback(options);
            }
          },
          function error() {
            $log.error(
              [
               'Enum:getOptions:' + name,
               'Unable to get ' + name + ' options',
              ].join('\n')
            );
          }
        );
      }
    };
  });
