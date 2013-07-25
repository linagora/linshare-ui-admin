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
      getAllLdapConnections: function(success, error) {
        Restangular.all('ldap_connections').getList().then(success, error);
      },
      getAllDomainPatterns: function(success, error) {
        Restangular.all('domain_patterns').getList().then(success, error);
      },
      getAllDomainPolicies: function(success, error) {
        Restangular.all('domain_policies').getList().then(success, error);
      },
      getAllUserRoles: function(success, error) {
        Restangular.all('user_roles').getList().then(success, error);
      },
      getAllLocales: ["en", "fr"],
      getAllDomains: function(success, error) {
        Restangular.all('domains').getList().then(function(domains) {
          traverse(domains,domains); 
          success(domains);
        }, error);
      }
    };
    return manageDomainService;
  }
]);
