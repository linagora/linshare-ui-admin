'use strict';

angular.module('linshareAdminApp').directive('lsMailLayoutForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', '$modal', '$translate', 'Restangular', 'Domain', 'MailLayout',
        function($scope, $log, $modal, $translate, Restangular, Domain, MailLayout) {
          $scope.$watch(MailLayout.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.mailLayout = newValue;
              }
            }
          );
          $scope.remove = function() {
            var modalInstance = $modal.open({
              templateUrl: 'views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return $translate('MAIL_LAYOUT.CONFIRM_DELETE_FORM.PARAGRAPH');
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                MailLayout.remove($scope.mailLayout,
                  function successCallback() {
                    $scope.cancel();
                  }
                );
              }, function cancel() {
                $log.debug('Deletion modal dismissed');
              }
            );
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
