'use strict';

angular.module('linshareAdminApp').directive('lsSidebar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', '$state', 'Authentication', 'Tab',
        function($scope, $log, $state, Authentication, Tab) {
          Authentication.getCurrentUser().then(function(user) {
            $scope.tabs = Tab.getAvailableTabs(user);
          });
          $scope.$watch('search', function(newValue) {
            var inSearch = !_.isEmpty(newValue);
            angular.forEach($scope.tabs, function(value) {
              value.isopen = inSearch;
            })
          });
          $scope.changeState = function(sref) {
            Authentication.getCurrentUser().then(function(user) {
              $state.go(sref, {domainId: user.domain});
            });
          };
        }
      ],
      templateUrl: 'ng_components/common/sidebar.tpl.html',
      replace: false
    };
  }
]);
