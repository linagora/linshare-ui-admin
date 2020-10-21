'use strict';

angular.module('linshareAdminApp')
  .factory('customDeleteService', customDeleteService);
  
  customDeleteService.$inject = ['$http', 'lsAppConfig', 'Restangular'];

  function customDeleteService($http, lsAppConfig, Restangular) {

    return {
      remove: function(resourceName, payload) {

        return $http({
          method: 'DELETE',
          url: lsAppConfig.backendURL + '/' + resourceName,
          headers: {
            'Content-Type': 'application/json'
          },
          data: Restangular.stripRestangular(payload).originalElement
        });
      }
    };
  }
