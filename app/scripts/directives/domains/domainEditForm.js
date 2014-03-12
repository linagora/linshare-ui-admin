'use strict';

app.directive('lsDomainEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
          scope.disableProvider = false;
          scope.showForm = false;
          scope.confirmDelete = true;
          scope.$on('currentDomainChanged', function() {
            if (!_.isNull(scope.currentDomain)) {
              scope.showForm = true;
            } else {
              scope.showForm = false;
            }
          });
          scope.$watch('domain.providers', function(value) {
            if (!angular.isUndefined(value) && value.length >= 1) {
              scope.disableProvider = true;
            } else {
              scope.disableProvider = false;
            }
          }, true);
      },
      controller: ['$scope', '$route', '$log', 'Restangular', 'notificationService',
        function($scope, $route, $log, Restangular, notificationService) {
          $scope.addProvider = function() {
            $scope.domain.providers.push({
              ldapConnectionId: '',
              domainPatternId: '',
              baseDn: ''
            });
          };
          $scope.deleteProvider = function() {
            $scope.domain.providers.splice(0, 1);
          }
          $scope.submit = function(domain) {
            $log.debug('domain edition: ' + domain.identifier);
            domain.put().then(function success(domains) {
              $scope.$broadcast('domainTreeNeedRefresh');
              notificationService.addSuccess('P_Domains-Management_UpdateSuccess');
            });
          };
          $scope.reset = function() {
            $scope.domain = Restangular.copy($scope.currentDomain);
          };
          $scope.delete = function(domain) {
            $log.debug('domain deletion: ' + domain.identifier);
            $scope.confirmDelete = true;
            domain.remove().then(function success() {
              $scope.$broadcast('domainTreeNeedRefresh');
              notificationService.addSuccess('P_Domains-Management_DeleteSuccess');
            });
          }
          $scope.$on('currentDomainChanged', function() {
            if (!_.isNull($scope.currentDomain)) {
              // Save the previous state
              $scope.reset();
            }
          });
        }
      ],
      templateUrl: '/views/templates/domains/domain_edit_form.html',
      replace: false
    };
  }
]);
