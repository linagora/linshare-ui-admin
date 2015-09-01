'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailFooter', 'currentDomain', 'currentMailFooter',
    function($scope, $log, $modal, $state, MailFooter, currentDomain, currentMailFooter) {
      $scope.mailFooter = currentMailFooter;
      $scope.domain = currentDomain;
      $scope.language = $state.params.language;

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
            MailFooter.remove($scope.mailFooter).then(function() {
              $state.go('mailfooter.list', {domainId: $scope.domain.label, language: $scope.language});
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function() {
        MailFooter.update($scope.mailFooter);
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

