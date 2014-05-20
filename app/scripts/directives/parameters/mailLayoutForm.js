'use strict';

angular.module('linshareAdminApp').directive('lsMailLayoutForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', 'Restangular', 'Domain', 'MailLayout',
        function($scope, $log, Restangular, Domain, MailLayout) {
          $scope.$watch(MailLayout.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.mailLayout = newValue;
              }
            }
          );
          $scope.remove = function() {
            MailLayout.remove($scope.mailLayout, function() {
              $scope.cancel();
            });
          };
          $scope.update = function() {
            MailLayout.update($scope.mailLayout, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            MailLayout.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mailLayout = Restangular.copy(MailLayout.getCurrent());
          };
        }
      ],
      templateUrl: 'views/templates/parameters/maillayout_form.html',
      replace: false
    };
  }
]);
