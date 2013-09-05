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
          
          function findUserRootDomain(domain, userDomain) {
            if (domain.identifier === userDomain) {
              return domain;
            }
            domain.route = rootDomain.route;
            if (!_.isEmpty(domain.children)) {
              angular.forEach(domain.children, function(child, key) {
                traverse(child, rootDomain);
              });
            }
          }
          $scope.$on('functionalityTreeNeedRefresh', function() {
            manageDomainService.getAllDomains(function success(domains) {
              $scope.userRootDomain = findUserRootDomain(domains, $scope.userLogged.domain);
              hideEditForm();
            });
          });
          $scope.$broadcast('functionalityTreeNeedRefresh');
        }
      ],
      templateUrl: '/views/templates/administration/functionality_tree.html',
      replace: false
    };
  }
]);
