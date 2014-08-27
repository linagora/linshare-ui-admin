'use strict';

angular.module('linshareAdminApp').directive('lsMailLayoutForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', '$modal', '$translate', 'Domain', 'MailLayout',
        function($scope, $log, $modal, $translate, Domain, MailLayout) {
          $scope.$watch(MailLayout.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.reset();
              }
            }
          );
          $scope.$watch(Domain.getLastAccess,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                if (angular.isDefined($scope.domain)) {
                  $scope.cancel();
                }
                $scope.domain = Domain.getCurrent();
              }
            }
          );
          $scope.remove = function() {
            var modalInstance = $modal.open({
              templateUrl: 'ng_components/common/confirm_modal.tpl.html',
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
            $scope.mailLayout = MailLayout.copyCurrent();
          };
        }
      ],
      templateUrl: 'ng_components/maillayout/maillayout_detail.tpl.html',
      replace: false
    };
  }
]);
