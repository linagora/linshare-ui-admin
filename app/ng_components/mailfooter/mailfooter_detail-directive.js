'use strict';

angular.module('linshareAdminApp').directive('lsMailFooterForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', '$modal', 'Domain', 'MailFooter',
        function($scope, $log, $modal, Domain, MailFooter) {
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
              templateUrl: 'ng_components/common/confirm_modal.tpl.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return 'MAIL_FOOTER.CONFIRM_DELETE_FORM.PARAGRAPH';
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
      templateUrl: 'ng_components/mailfooter/mailfooter_detail.tpl.html',
      replace: false
    };
  }
]);
