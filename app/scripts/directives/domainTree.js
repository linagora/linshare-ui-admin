'use strict';

app.directive('linshareDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attrs) {
        scope.editForm = false;
        scope.$watch('currentDomain', function() {
          scope.editForm = true;
        });
      },
      controller: ['$scope', '$rootScope',
        function($scope, $rootScope) {
          $scope.hasGuestDomain = function(topDomain) {
            return !_.isEmpty(
              _.find(topDomain.children, {
                'type': 'GUESTDOMAIN'
              })
            );
          };
          $scope.configDomain = function(domain) {
            $scope.currentDomain = domain;
            $rootScope.$broadcast('currentDomainChanged');
          };
        }
      ],
      templateUrl: '/views/templates/domain_tree.html',
      replace: false
    };
  }
]);
