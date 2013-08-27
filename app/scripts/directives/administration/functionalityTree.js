'use strict';

app.directive('lsFunctionalityTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      controller: ['$scope', 'manageDomainService','loggerService',
        function($scope, manageDomainService, Logger) {
          $scope.hasGuestDomain = function(topDomain) {
            return !_.isEmpty(
              _.find(topDomain.children, {
                'type': 'GUESTDOMAIN'
              })
            );
          };
          function hideEditForm() {
            $scope.currentDomain = null;
            $scope.$broadcast('currentDomainChanged');
          }
          $scope.configDomain = function(domain) {
            $scope.currentDomain = domain;
            $scope.$broadcast('currentDomainChanged');
          };
          $scope.$on('functionalityTreeNeedRefresh', function() {
            manageDomainService.getAllDomains(function success(domains) {
              $scope.rootDomain = domains;
              hideEditForm();
            });
          });
        }
      ],
      templateUrl: '/views/templates/administration/functionality_tree.html',
      replace: false
    };
  }
]);
