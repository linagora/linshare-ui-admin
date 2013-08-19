'use strict';

app.directive('lsDomainPatternCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService',
        function($scope, $rootScope, Restangular, Logger) {
          $scope.submit = function(domainPattern) {
            Logger.debug('domainPattern creation :' + domainPattern.identifier);
            Logger.debug(domainPattern);
            Restangular.all('domain_patterns').post(domainPattern).then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $rootScope.$broadcast('showList');
              $scope.reset();
            }, function error() {
              Logger.error('Unable to create the domainPattern : ' + domainPattern.identifier);
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
