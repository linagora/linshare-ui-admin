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
      controller: ['$scope', '$route', 'Restangular', 'loggerService',
        function($scope, $route, Restangular, Logger) {
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
          $scope.submit = function(editDomainForm, domain) {
            if (editDomainForm.$valid) {
              Logger.debug('domain edition :' + domain.identifier);
              domain.put().then(function success(domains) {
                $scope.$broadcast('domainTreeNeedRefresh');
              }, function error() {
                Logger.error('Unable to update the domain : ' + domain.identifier);
              });
            }
          };
          $scope.reset = function() {
            $scope.domain = Restangular.copy($scope.currentDomain);
          };
          $scope.delete = function(domain) {
            Logger.debug('domain deletion : ' + domain.identifier);
            $scope.confirmDelete = true;
            domain.remove().then(function success() {
              $scope.$broadcast('domainTreeNeedRefresh');
            }, function error() {
              Logger.error('Unable to delete the domain : ' + domain.identifier);
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
