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
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'notificationService',
        function($scope, $rootScope, $log, Restangular, notificationService) {
          $scope.submit = function(domainPattern) {
            $log.debug('domainPattern edition: ' + domainPattern.identifier);
            domainPattern.put().then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
              notificationService.addSuccess('P_Domains-DomainPatterns_UpdateSuccess');
            });
          };
          $scope.reset = function() {
            $scope.domainPattern = Restangular.copy($scope.domainPatternToEdit);
          };
          $scope.delete = function(domainPattern) {
            $log.debug('domainPattern deletion: ' + domainPattern.identifier);
            domainPattern.remove().then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
              notificationService.addSuccess('P_Domains-DomainPatterns_DeleteSuccess');
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
