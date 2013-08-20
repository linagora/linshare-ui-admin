'use strict';

app.directive('lsAlertBox', [
  function() {
    return {
      restrict: 'A',
      scope: false,
      controller: ['$scope', 'localize', 'alertService',
        function($scope, Localize, Alert) {
          $scope.alerts = [];
          $scope.$on('pushAlertSuccess', function(event, newAlert, message) {
            $scope.alerts.push({type: newAlert.severity, msg: message});
          });
          $scope.$on('pushAlertError', function(event, newAlert) {
            $scope.alerts.push({type: newAlert.severity, msg: Localize.getLocalizedString('G_Err_' + newAlert.errCode)});
          });
          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          }
        }
      ],
      templateUrl: '/views/templates/style/alert-box.html',
      replace: false
    };
  }
]);
