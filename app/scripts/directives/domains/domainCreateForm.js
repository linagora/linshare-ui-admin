'use strict';

app.directive('lsDomainCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      // Use new scope to not interfere with edit domain form
      scope: {
        domainPolicies: '=',
        userRoles: '=',
        locales: '='
      },
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
      controller: ['$scope', '$rootScope', '$log', 'manageDomainService', 'Restangular', 'notificationService',
        function($scope, $rootScope, $log, manageDomainService, Restangular, notificationService) {
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
            $log.debug('domain creation: ' + domain.identifier);
            Restangular.all('domains').post(domain).then(function success() {
              $scope.close();
              $rootScope.$broadcast('domainTreeNeedRefresh');
              notificationService.addSuccess('P_Domains-DomainPatterns_CreateSuccess');
            });
          };
        }
      ],
      templateUrl: '/views/templates/domains/domain_create_form.html',
      replace: false
    };
  }
]);
