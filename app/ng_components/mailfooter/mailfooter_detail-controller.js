'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailFooter', 'currentDomain', 'currentMailFooter',
    function($scope, $log, $modal, $state, MailFooter, currentDomain, currentMailFooter) {
      $scope.mailFooter = currentMailFooter;
      $scope.domain = currentDomain;

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
        $state.go('mailfooter.list', {domainId: $state.params.domainId});
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

