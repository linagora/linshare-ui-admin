'use strict';

angular.module('linshareAdminApp').directive('lsSidebar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', 'Authentication', 'Tab',
        function($scope, $log, Authentication, Tab) {
          Authentication.getCurrentUser().then(function successCallback(user) {
            $scope.tabs = Tab.getAvailableTabs(user);
          });
          $scope.$watch('search', function(newValue) {
            var inSearch = !_.isEmpty(newValue);
            angular.forEach($scope.tabs, function(value) {
              value.isopen = inSearch;
            })
          });
        }
      ],
      templateUrl: 'ng_components/common/sidebar.tpl.html',
      replace: false
    };
  }
]);
