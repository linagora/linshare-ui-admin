'use strict';

app.directive('linshareCreateDomainForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      // Use new scope to not interfere with edit domain form
      scope: {},
      link: function(scope, element, attrs) {
        scope.disableProvider = false;
        scope.showCreationModal = false;
        scope.addProvider = function() {
          scope.domain.providers.push({
            ldapConnection: '',
            domainPattern: '',
            baseDn: ''
          });
        };
        scope.deleteProvider = function() {
          scope.domain.providers.splice(0, 1);
        }
        scope.$watch('domain.providers', function(value) {
          if (!angular.isUndefined(value) && value.length >= 1) {
            scope.disableProvider = true;
          } else {
            scope.disableProvider = false;
          }
        }, true);
        scope.close = function() {
          scope.showCreationModal = false;
        };
        scope.$on('addChildDomain', function() {
          scope.showCreationModal = true;
        });
        scope.opts = {
          backdropFade: true,
          dialogFade: true
        };
      },
      controller: ['$scope', '$rootScope', 'manageDomainService', 'Restangular', 'loggerService',
        function($scope, $rootScope, manageDomainService, Restangular, Logger) {
          $scope.$on('addChildDomain', function() {
            $scope.reset = function() {
              $scope.domain = {
                parent: manageDomainService.parentDomain.identifier,
                type: manageDomainService.domainTypeToCreate,
                providers: []
              };
              if ($scope.domain.type === 'GUESTDOMAIN') {
                $scope.domain.userRole = 'SIMPLE';
              }
            };
            $scope.reset();
          });
          $scope.submit = function(domain) {
            Logger.debug('domain creation :' + domain.identifier);
            Restangular.all('domains').post(domain).then(function successCallback() {
              $scope.close();
              $rootScope.$broadcast('domainTreeNeedRefresh');
            }, function errorCallback() {
              Logger.error('Unable to create the domain : ' + domain.identifier);
            });
          };

          // Has it's a new scope you need to reload all possible choices

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
        }
      ],
      templateUrl: '/views/templates/forms/create_domain.html',
      replace: false
    };
  }
]);
