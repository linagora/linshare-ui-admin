'use strict';

app.controller('DomainCreateFormCtrl',
[ 
  '$scope',
  '$rootScope',
  '$log',
  '$modal',
  'manageDomainService',

  function($scope, $rootScope, $log, $modal, manageDomainService) {
    $scope.disableProvider = false;
    $scope.$on('addChildDomain', function() {
      var modalInstance = $modal.open({
        controller: DomainModalInstanceCtrl,
        templateUrl: '/views/templates/domains/domain_create_form.html',
        resolve: {
          domainPolicies: function() {
            return $scope.domainPolicies;
          },
          userRoles: function() {
            return $scope.userRoles;
          },
          locales: function() {
            return $scope.locales;
          }
        }
      });
      modalInstance.result.then(function(domain) {
        $rootScope.$broadcast('domainTreeNeedRefresh');
      });
    });
  }
]);

var DomainModalInstanceCtrl = 
[
  '$scope',
  '$log',
  '$modalInstance',
  'Restangular',
  'Notification',

  function($scope,  $log, $modalInstance, Restangular, Notification) {
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
    $scope.submit = function(domain) {
      $log.debug('domain creation: ' + domain.identifier);
      Restangular.all('domains').post(domain).then(function success() {
        Notification.addSuccess('P_Domains-Management_CreateSuccess');
        $modal.close(domain);
      });
    };
    $scope.reset();
  }
];
