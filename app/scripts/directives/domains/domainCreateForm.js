'use strict';

app.directive('linshareDomainCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      // Use new scope to not interfere with edit domain form
      scope: {},
      link: function(scope, element, attrs) {
        scope.disableProvider = false;
        scope.showCreationModal = false;
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
          $scope.submit = function(createDomainForm, domain) {
            if (createDomainForm.$valid) {
              Logger.debug('domain creation :' + domain.identifier);
              Restangular.all('domains').post(domain).then(function success() {
                $scope.close();
                $rootScope.$broadcast('domainTreeNeedRefresh');
              }, function error() {
                Logger.error('Unable to create the domain : ' + domain.identifier);
              });
            }
          };

          // Has it's a new scope you need to reload all possible choices

          $scope.ldapConnections = [];
          manageDomainService.getAllLdapConnections(function success(ldapConnections) {
            angular.forEach(ldapConnections, function(ldapConnection, key) {
              $scope.ldapConnections.push(ldapConnection.identifier);
            });
          }, function error() {
            Logger.error('Unable to get ldap connections list');
          });
          $scope.domainPatterns = [];
          manageDomainService.getAllDomainPatterns(function success(domainPatterns) {
            angular.forEach(domainPatterns, function(domainPattern, key) {
              $scope.domainPatterns.push(domainPattern.identifier);
            });
          }, function error() {
            Logger.error('Unable to get domain patterns list');
          });
          $scope.domainPolicies = [];
          manageDomainService.getAllDomainPolicies(function success(domainPolicies) {
            angular.forEach(domainPolicies, function(domainPolicy, key) {
              $scope.domainPolicies.push(domainPolicy.identifier);
            });
          }, function error() {
            Logger.error('Unable to get domain policies list');
          });
          $scope.userRoles = [];
          manageDomainService.getAllUserRoles(function success(userRoles) {
            angular.forEach(userRoles, function(userRole, key) {
              if (userRole != 'SYSTEM' && userRole != 'SUPERADMIN') {
                $scope.userRoles.push(userRole);
              }
            });
          }, function error() {
            Logger.error('Unable to get user roles list');
          });
          $scope.locales = manageDomainService.getAllLocales;
        }
      ],
      templateUrl: '/views/templates/domains/create_domain.html',
      replace: false
    };
  }
]);
