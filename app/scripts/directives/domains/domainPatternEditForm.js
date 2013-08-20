'use strict';

app.directive('lsDomainPatternEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.confirmCollapsed = true;
        scope.hideForm = false;
      },
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService',
        function($scope, $rootScope, Restangular, Logger) {
          $scope.submit = function(domainPattern) {
            Logger.debug('domainPattern edition :' + domainPattern.identifier);
            Logger.debug(domainPattern);
            domainPattern.put().then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
            }, function error() {
              Logger.error('Unable to update the domainPattern : ' + domainPattern.identifier);
            });
          };
          $scope.reset = function() {
            $scope.domainPattern = Restangular.copy($scope.domainPatternToEdit);
          };
          $scope.delete = function(domainPattern) {
            Logger.debug('domainPattern deletion : ' + domainPattern.identifier);
            Logger.debug(domainPattern);
            domainPattern.remove().then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
            }, function error() {
              Logger.error('Unable to delete the domainPattern : ' + domainPattern.identifier);
            });
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_pattern_edit_form.html',
      replace: false
    };
  }
]);
