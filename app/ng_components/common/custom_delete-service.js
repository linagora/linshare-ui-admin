'use strict';

angular.module('linshareAdminApp')
  .factory('customDeleteService', customDeleteService);

  customDeleteService.$inject = ['$http', 'lsAppConfig', 'Restangular'];

  function customDeleteService($http, lsAppConfig, Restangular) {

    return {
      remove: function(resourceName, payload, plainDelete) {
        return $http({
          method: 'DELETE',
          url: lsAppConfig.backendURL + '/' + resourceName,
          headers: {
            'Content-Type': 'application/json'
          },
          data: !!plainDelete ?
            payload :
            Restangular.stripRestangular(payload).originalElement
        });
      }
    };
  }
