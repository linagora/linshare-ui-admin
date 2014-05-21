'use strict';

angular.module('linshareAdminApp').directive('lsMailContentForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', '$modal', '$translate', 'Restangular', 'Domain', 'MailContent',
        function($scope, $log, $modal, $translate, Restangular, Domain, MailContent) {
          $scope.$watch(MailContent.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.mailContent = newValue;
              }
            }
          );
          $scope.remove = function() {
            var modalInstance = $modal.open({
              templateUrl: 'views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return $translate('MAIL_CONTENT.CONFIRM_DELETE_FORM.PARAGRAPH');
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                MailContent.remove($scope.mailContent,
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
