'use strict';

app.controller('DomainManagementCtrl', ['$scope', 'manageDomainService', 'Restangular', 'loggerService',
  function($scope, manageDomainService, Restangular, Logger) {
    $scope.ldapConnections = [];
    manageDomainService.getAllLdapConnections(function successCallback(ldapConnections) {
      angular.forEach(ldapConnections, function(ldapConnection, key) {
        $scope.ldapConnections.push(ldapConnection.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get ldap connections list');
    });
    $scope.domainPatterns = [];
    manageDomainService.getAllDomainPatterns(function successCallback(domainPatterns) {
      angular.forEach(domainPatterns, function(domainPattern, key) {
        $scope.domainPatterns.push(domainPattern.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get domain patterns list');
    });
    $scope.domainPolicies = [];
    manageDomainService.getAllDomainPolicies(function successCallback(domainPolicies) {
      angular.forEach(domainPolicies, function(domainPolicy, key) {
        $scope.domainPolicies.push(domainPolicy.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get domain policies list');
    });
    $scope.userRoles = [];
    manageDomainService.getAllUserRoles(function successCallback(userRoles) {
      angular.forEach(userRoles, function(userRole, key) {
        if (userRole != 'SYSTEM' && userRole != 'SUPERADMIN') {
          $scope.userRoles.push(userRole);
        }
      });
    }, function errorCallback() {
      Logger.error('Unable to get user roles list');
    });
    $scope.locales = manageDomainService.getAllLocales;
    $scope.$broadcast('domainTreeNeedRefresh');
    manageDomainService.getAllDomains(function successCallback(domains) {
      $scope.rootDomain = domains;
    }, function errorCallback() {
      Logger.error('Unable to get domain policies list');
    });
  }
]);
