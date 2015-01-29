'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailContent', 'currentDomain', 'currentMailContent',
    function($scope, $log, $modal, $state, MailContent, currentDomain, currentMailContent) {
      $scope.mailContent = currentMailContent;
      $scope.domain = currentDomain;

      $scope.remove = function() {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'MAIL_CONTENT.CONFIRM_DELETE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            MailContent.remove($scope.mailContent).then(function() {
              $scope.cancel();
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function() {
        MailContent.update($scope.mailContent).then(function() {
          $scope.cancel();
        });
      };
      $scope.cancel = function() {
        $state.go('mailcontent.list', {domainId: $state.params.domainId, language: $state.params.language});
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

