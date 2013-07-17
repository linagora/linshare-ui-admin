'use strict';

app.directive('linshareCreateDomainForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
          scope.disableProvider = false;
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
      },
      controller: ['$scope', '$route', 'Restangular', 'loggerService',
        function($scope, $route, Restangular, Logger) {
          $scope.submit = function(domain) {
            Logger.debug('domain creation :' + domain.identifier);
            Restangular.all('domains').post(domain).then(function successCallback() {
              // refresh the page
              $route.reload();
            }, function errorCallback() {
              Logger.error('Unable to create the domain : ' + domain.identifier);
            });
          };
          $scope.reset = function() {
            $scope.domain = {};
          };
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/forms/create_domain.html',
      replace: false
    };
  }
]);
