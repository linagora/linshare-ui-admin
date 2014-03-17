'use strict';

app.controller('DomainManagementCtrl', ['$scope', '$log', 'manageDomainService',
  function($scope, $log, manageDomainService) {
    $scope.ldapConnections = [];
    $scope.domainPatterns = [];
    $scope.domainPolicies = [];
    $scope.userRoles = [];
    $scope.locales = manageDomainService.getAllLocales;
    $scope.domainTree = {};

    var getIds = function(dataArray, scopeContainer) {
      var array = [];
      angular.forEach(dataArray, function(data) {
        array.push(data.identifier);
      });
      scopeContainer = array;
    }
    var logError = function(string) {
      $log.error(string);
    }

    $scope.fetchAllLdapConnections = function() {
      manageDomainService.getAllLdapConnections(
        function success(ldapConnections) {
          getIds(ldapConnections, $scope.ldapConnections);
        }
      ,
        function error() {
          logError('Unable to get ldap connections list');
        }
      );
    };
    $scope.fetchAllDomainPatterns = function() {
      manageDomainService.getAllDomainPatterns(
        function success(domainPatterns) {
          getIds(domainPatterns, $scope.domainPatterns);
        }
      ,
        function error() {
          logError('Unable to get ldap connections list');
        }
      );
    };
    $scope.fetchAllDomainPolicies = function() {
      manageDomainService.getAllDomainPolicies(
        function success(domainPolicies) {
          getIds(domainPolicies, $scope.domainPolicies);
        }
      ,
        function error() {
          logError('Unable to get domain policies list');
        }
      );
    };
    $scope.fetchAllUserRoles = function() {
      manageDomainService.getAllUserRoles(
        function success(userRoles) {
          getIds(userRoles, $scope.userRoles);
        }
      ,
        function error() {
          logError('Unable to get domain policies list');
        }
      );
    };
    $scope.fetchDomainTree = function() {
      manageDomainService.getDomainTree(
        function success(domainTree) {
          $scope.domainTree = domainTree;
        }
      ,
        function error() {
          logError('Unable to get domain tree');
        }
      );
    };
  }
]);
