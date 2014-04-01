'use strict';

app.directive('lsSidebar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', 'Authentication', 'Tab',
        function($scope, $log, Authentication, Tab) {
          $scope.$watch(Authentication.getCurrentUser,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.tabs = Tab.getAvailableTabs(newValue);
              }
            },
            true
          );
        }
      ],
      templateUrl: '/views/templates/common/sidebar.html',
      replace: false
    };
  }
]);
