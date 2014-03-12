'use strict';

/* Services */

angular.module('myApp.services')
  .factory('manageDomainService', ['$rootScope', '$log', 'Restangular',
  function($rootScope, $log, Restangular) {
    /**
     * As domains are returned as tree, 
     * we need to put restangular route manually in all domains
     */
    function traverse(domain, rootDomain) {
      domain.route = rootDomain.route;
      if (!_.isEmpty(domain.children)) {
        angular.forEach(domain.children, function(child) {
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
        $log.debug('getAllLdapConnections');
        Restangular.all('ldap_connections').getList().then(success, error);
      },
      getAllDomainPatterns: function(success, error) {
        $log.debug('getAllDomainPatterns');
        Restangular.all('domain_patterns').getList().then(success, error);
      },
      getAllDomainPolicies: function(success, error) {
        $log.debug('getAllDomainPolicies');
        Restangular.all('domain_policies').getList().then(success, error);
      },
      getAllUserRoles: function(success, error) {
        $log.debug('getAllUserRoles');
        Restangular.all('user_roles').getList().then(success, error);
      },
      getAllLocales: ['en', 'fr'],
      getAllDomains: function(success, error) {
        $log.debug('getAllDomains');
        Restangular.all('domains').get('LinShareRootDomain').then(function(domains) {
          traverse(domains,domains);
          success(domains);
        }, error);
      }
    };
    return manageDomainService;
  }
]);
