'use strict';

angular.module('linshareAdminApp')
  .controller('MailLayoutDetailCtrl',
    ['$scope', '$log', '$modal', '$state', 'MailLayout', 'currentDomain', 'currentMailLayout',
    function($scope, $log, $modal, $state, MailLayout, currentDomain, currentMailLayout) {
      $scope.mailLayout = currentMailLayout;
      $scope.domain = currentDomain;

      $scope.remove = function() {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'MAIL_LAYOUT.CONFIRM_DELETE_FORM.PARAGRAPH';
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
        $state.go('maillayout.list', {domainId: $state.params.domainId});
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

