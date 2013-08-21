'use strict';

app.directive('lsDomainPatternCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService', 'notificationService',
        function($scope, $rootScope, Restangular, Logger, notificationService) {
          $scope.submit = function(domainPattern) {
            Logger.debug('domainPattern creation: ' + domainPattern.identifier);
            Restangular.all('domain_patterns').post(domainPattern).then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $rootScope.$broadcast('showList');
              $scope.reset();
              notificationService.addSuccess('P_Domains-DomainPatterns_CreateSuccess');
            });
          };
          $scope.reset = function() {
            $scope.domainPattern = {};
          };
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_pattern_create_form.html',
      replace: false
    };
  }
]);
