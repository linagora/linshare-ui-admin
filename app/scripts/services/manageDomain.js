'use strict';

/* Services */

angular.module('myApp.services')
  .factory('manageDomainService', ['$rootScope', '$log', 'Restangular',
  function($rootScope, $log, Restangular) {
    var manageDomainService = {
      parentDomain: '',
      domainTypeToCreate: '',
      addChildDomain: function(parentDomain, domainTypeToCreate) {
        this.parentDomain = parentDomain;
        this.domainTypeToCreate = domainTypeToCreate;
        $rootScope.$broadcast('addChildDomain');
      },
      getAllLocales: ['en', 'fr'],
    };
    return manageDomainService;
  }
]);
