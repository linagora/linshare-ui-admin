'use strict';

angular.module('linshareAdminApp').directive('lsMailFooterForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', '$modal', '$translate', 'Domain', 'MailFooter',
        function($scope, $log, $modal, $translate, Domain, MailFooter) {
          $scope.$watch(MailFooter.getCurrent,
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
              templateUrl: 'views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return $translate('MAIL_FOOTER.CONFIRM_DELETE_FORM.PARAGRAPH');
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                MailFooter.remove($scope.mailFooter,
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
            MailFooter.update($scope.mailFooter, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            MailFooter.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mailFooter = MailFooter.copyCurrent();
          };
        }
      ],
      templateUrl: 'views/templates/parameters/mailfooter_form.html',
      replace: false
    };
  }
]);
