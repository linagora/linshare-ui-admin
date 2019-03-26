'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterDetailCtrl',MailFooterDetailCtrl);

MailFooterDetailCtrl.$inject =[
  '$log',
  '$modal',
  '$scope',
  '$state',
  '$translate',
  'currentDomain',
  'currentMailFooter',
  'MailFooter',
  'Notification',
  'mailLanguage'
];

function MailFooterDetailCtrl(
  $log,
  $modal,
  $scope,
  $state,
  $translate,
  currentDomain,
  currentMailFooter,
  MailFooter,
  Notification,
  mailLanguage
) {
  $scope.mailLanguage = mailLanguage;
  $scope.mailFooter = currentMailFooter;
  $scope.domain = currentDomain;
  $scope.copy = copy;
  $scope.capitalize = capitalize;

  /**
   * @name capitalize
   * @desc Capitalize a word
   * @param {string} text - Text to be capitalize
   * @returns {string} the passed string capitalized
   * @memberOf linshareAdminApp.MailContentDetailCtrl
   */
  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  }

  /**
   * @name copy
   * @desc Copy a mail content
   * @memberOf linshareAdminApp.MailFooterDetailCtrl
   */
  function copy() {
    var copyText;
    $translate('MAIL_FOOTER.BOX_FORM.TEXT_COPY').then(function(data) {
      copyText = data + ' ';
      var modalScope = $scope.$new();
      modalScope.mailFooter = {};
      modalScope.mailFooter.description = copyText + $scope.mailFooter.description;
      modalScope.domainUuid = currentDomain.identifier;
      modalScope.modelUuid = currentMailFooter.uuid;
      var modalInstance = $modal.open({
        controller: 'mailFooterModalCtrl',
        templateUrl: 'ng_components/mailfooter/mailfooter_modal.tpl.html',
        scope: modalScope
      });
      modalInstance.result.then(function() {
      }).catch(function() {});
    }).catch (function(error) {
      Notification.addError(error);
    });
  }

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
          $state.go('mailfooter.list', {domainId: $scope.domain.label });
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
}
