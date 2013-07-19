'use strict';

app.directive('linshareEditDomainForm', [
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
              ldapConnection: '',
              domainPattern: '',
              baseDn: ''
            });
          };
          $scope.deleteProvider = function() {
            $scope.domain.providers.splice(0, 1);
          }
          $scope.$on('currentDomainChanged', function() {
            if (!_.isNull($scope.currentDomain)) {
              $scope.submit = function(domain) {
                Logger.debug('domain edition :' + domain.identifier);
                if (_.isUndefined(domain.route)) {
                  domain.route = 'domains';
                }
                domain.put().then(function successCallback(domains) {
                  $scope.$broadcast('domainTreeNeedRefresh');
                }, function errorCallback() {
                  Logger.error('Unable to update the domain : ' + domain.identifier);
                });
              };
              $scope.reset = function() {
                $scope.domain = Restangular.copy($scope.currentDomain);
              };
              $scope.delete = function(domain) {
                Logger.debug('domain deletion : ' + domain.identifier);
                domain.remove().then(function successCallback() {
                  $scope.$broadcast('domainTreeNeedRefresh');
                }, function errorCallback() {
                  Logger.error('Unable to delete the domain : ' + domain.identifier);
                });
              }
              // Save the previous state
              $scope.reset();
            }
          });
        }
      ],
      templateUrl: '/views/templates/forms/edit_domain.html',
      replace: false
    };
  }
]);
