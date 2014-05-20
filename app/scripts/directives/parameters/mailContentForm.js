'use strict';

angular.module('linshareAdminApp').directive('lsMailContentForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', 'Restangular', 'Domain', 'MailContent',
        function($scope, $log, Restangular, Domain, MailContent) {
          $scope.$watch(MailContent.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.mailContent = newValue;
              }
            }
          );
          $scope.remove = function() {
            MailContent.remove($scope.mailContent, function() {
              $scope.cancel();
            });
          };
          $scope.update = function() {
            MailContent.update($scope.mailContent, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            MailContent.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mailContent = Restangular.copy(MailContent.getCurrent());
          };
        }
      ],
      templateUrl: 'views/templates/parameters/mailcontent_form.html',
      replace: false
    };
  }
]);
