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
            MailLayout.remove($scope.mailLayout).then(function() {
                $scope.cancel();
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function() {
        MailLayout.update($scope.mailLayout).then(function() {
          $scope.cancel();
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

