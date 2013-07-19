'use strict';

/* Services */

angular.module('myApp.services')
  .factory('manageDomainService', ['$rootScope', 'Restangular', 'loggerService',
  function($rootScope, Restangular, Logger) {
    /**
     * As domains are returned as tree, 
     * we need to put restangular route manually in all domains
     */
    function traverse(domain, rootDomain) {
      domain.route = rootDomain.route;
      if (!_.isEmpty(domain.children)) {
        angular.forEach(domain.children, function(child, key) {
          traverse(child, rootDomain);
        });
      }
    }
    var manageDomainService = {
      parentDomain: '',
      domainTypeToCreate: '',
      addChildDomain: function(parentDomain, domainTypeToCreate) {
        this.parentDomain = parentDomain;
        this.domainTypeToCreate = domainTypeToCreate;
        $rootScope.$broadcast('addChildDomain');
      },
      getAllLdapConnections: function(successCallback, errorCallback) {
        Restangular.all('ldap_connections').getList().then(successCallback, errorCallback);
      },
      getAllDomainPatterns: function(successCallback, errorCallback) {
        Restangular.all('domain_patterns').getList().then(successCallback, errorCallback);
      },
      getAllDomainPolicies: function(successCallback, errorCallback) {
        Restangular.all('domain_policies').getList().then(successCallback, errorCallback);
      },
      getAllUserRoles: function(successCallback, errorCallback) {
        Restangular.all('user_roles').getList().then(successCallback, errorCallback);
      },
      getAllLocales: ["en", "fr"],
      getAllDomains: function(successCallback, errorCallback) {
        Restangular.all('domains').getList().then(function(domains) {
          traverse(domains,domains); 
          successCallback(domains);
        }, errorCallback);
      }
    };
    return manageDomainService;
  }
]);
