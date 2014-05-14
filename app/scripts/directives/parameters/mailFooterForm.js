'use strict';

angular.module('linshareAdminApp').directive('lsMailFooterForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', 'Restangular', 'Domain', 'MailFooter',
        function($scope, $log, Restangular, Domain, MailFooter) {
          $scope.$watch(MailFooter.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.mailFooter = newValue;
              }
            }
          );
          $scope.remove = function() {
            MailFooter.remove($scope.mailFooter);
          };
          $scope.update = function() {
            MailFooter.update($scope.mailFooter, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            MailFooter.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mailFooter = Restangular.copy(MailFooter.getCurrent());
          };
        }
      ],
      templateUrl: 'views/templates/parameters/mailfooter_form.html',
      replace: false
    };
  }
]);
