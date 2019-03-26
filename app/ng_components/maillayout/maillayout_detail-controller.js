'use strict';

angular
  .module('linshareAdminApp')
  .controller('MailLayoutDetailCtrl', MailLayoutDetailCtrl);

MailLayoutDetailCtrl.$inject =
  [
    '$log',
    '$modal',
    '$scope',
    '$state',
    '$translate',
    'currentDomain',
    'currentMailLayout',
    'MailLayout',
    'Notification',
    'mailLanguage'
  ];

function MailLayoutDetailCtrl(
  $log,
  $modal,
  $scope,
  $state,
  $translate,
  currentDomain,
  currentMailLayout,
  MailLayout,
  Notification,
  mailLanguage
) {
  $scope.mailLanguage = mailLanguage;
  $scope.mailLayout = currentMailLayout;
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
   * @memberOf linshareAdminApp.MailLayoutDetailCtrl
   */
  function copy() {
    var copyText;
    $translate('MAIL_LAYOUT.BOX_FORM.TEXT_COPY').then(function(data) {
      copyText = data + ' ';
      var modalScope = $scope.$new();
      modalScope.mailLayout = {};
      modalScope.mailLayout.description = copyText + $scope.mailLayout.description;
      modalScope.domainUuid = currentDomain.identifier;
      modalScope.modelUuid = currentMailLayout.uuid;
      var modalInstance = $modal.open({
        controller: 'mailLayoutModalCtrl',
        templateUrl: 'ng_components/maillayout/maillayout_modal.tpl.html',
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
          return 'MAIL_LAYOUT.CONFIRM_DELETE_FORM.PARAGRAPH';
        }
      }
    });
    modalInstance.result.then(
      function validate() {
        MailLayout.remove($scope.mailLayout).then(function() {
          $state.go('maillayout.list', {domainId: $scope.domain.label});
        });
      }, function cancel() {
        $log.debug('Deletion modal dismissed');
      }
    );
  };
  $scope.update = function() {
    MailLayout.update($scope.mailLayout);
  };
  $scope.reset = function() {
    $state.reinit();
  };
}
