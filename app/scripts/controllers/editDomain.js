'use strict';

app.controller('EditDomainCtrl', ['$scope', 'Restangular', 'loggerService',
  function($scope, Restangular, Logger) {
    $scope.ldapConnections = [];
    Restangular.all('ldap_connections').getList().then(function successCallback(ldapConnections) {
      angular.forEach(ldapConnections, function(ldapConnection, key) {
        $scope.ldapConnections.push(ldapConnection.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get ldap connections list');
    });
    $scope.domainPatterns = [];
    Restangular.all('domain_patterns').getList().then(function successCallback(domainPatterns) {
      angular.forEach(domainPatterns, function(domainPattern, key) {
        $scope.domainPatterns.push(domainPattern.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get domain patterns list');
    });
    $scope.domainPolicies = [];
    Restangular.all('domain_policies').getList().then(function successCallback(domainPolicies) {
      angular.forEach(domainPolicies, function(domainPolicy, key) {
        $scope.domainPolicies.push(domainPolicy.identifier);
      });
    }, function errorCallback() {
      Logger.error('Unable to get domain policies list');
    });
    $scope.userRoles = [];
    Restangular.all('user_roles').getList().then(function successCallback(userRoles) {
      angular.forEach(userRoles, function(userRole, key) {
        if (userRole != 'SYSTEM' && userRole != 'SUPERADMIN') {
          $scope.userRoles.push(userRole);
        }
      });
    }, function errorCallback() {
      Logger.error('Unable to get user roles list');
    });
    $scope.locales = ["en", "fr"];
    Restangular.all('domains').getList().then(function successCallback(domains) {
      $scope.rootDomain = domains;
    }, function errorCallback() {
      Logger.error('Unable to get domains list');
    })
  }
]);
