'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailContent', 'currentDomain', 'currentMailContent',
    function($scope, $log, $modal, $state, MailContent, currentDomain, currentMailContent) {
      $scope.mailContent = currentMailContent;
      $scope.domain = currentDomain;
      $scope.language = $state.params.language;

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
              $state.go('mailcontent.list', {domainId: $scope.domain.label, language: $scope.language});
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function() {
        MailContent.update($scope.mailContent);
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

