'use strict';

angular.module('linshareAdminApp').directive('lsAlertBox', [
  function() {
    return {
      restrict: 'A',
      scope: false,
      controller: ['$scope',
        function($scope) {
          $scope.alerts = [];
          $scope.$on('pushAlert', function(event, newAlert, message) {
            $scope.alerts.push(newAlert);
            window.scrollTo(0,0);
          });
          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          }
        }
      ],
      templateUrl: 'ng_components/common/alert.tpl.html',
      replace: false
    };
  }
]);
