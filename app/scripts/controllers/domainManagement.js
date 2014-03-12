'use strict';

app.controller('DomainManagementCtrl', ['$scope', '$log', 'manageDomainService', 'Restangular',
  function($scope, $log, manageDomainService, Restangular) {
    $scope.ldapConnections = [];
    manageDomainService.getAllLdapConnections(function success(ldapConnections) {
      angular.forEach(ldapConnections, function(ldapConnection) {
        $scope.ldapConnections.push(ldapConnection.identifier);
      });
    }, function error() {
      $log.error('Unable to get ldap connections list');
    });
    $scope.domainPatterns = [];
    manageDomainService.getAllDomainPatterns(function success(domainPatterns) {
      angular.forEach(domainPatterns, function(domainPattern) {
        $scope.domainPatterns.push(domainPattern.identifier);
      });
    }, function error() {
      $log.error('Unable to get domain patterns list');
    });
    $scope.domainPolicies = [];
    manageDomainService.getAllDomainPolicies(function success(domainPolicies) {
      angular.forEach(domainPolicies, function(domainPolicy) {
        $scope.domainPolicies.push(domainPolicy.identifier);
      });
    }, function error() {
      $log.error('Unable to get domain policies list');
    });
    $scope.userRoles = [];
    manageDomainService.getAllUserRoles(function success(userRoles) {
      angular.forEach(userRoles, function(userRole) {
        if (userRole !== 'SYSTEM' && userRole !== 'SUPERADMIN') {
          $scope.userRoles.push(userRole);
        }
      });
    }, function error() {
      $log.error('Unable to get user roles list');
    });
    $scope.locales = manageDomainService.getAllLocales;
    $scope.$broadcast('domainTreeNeedRefresh');
    manageDomainService.getAllDomains(function success(domains) {
      $scope.rootDomain = domains;
    }, function error() {
      $log.error('Unable to get domain policies list');
    });
  }
]);
