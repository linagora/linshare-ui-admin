/**
 * MailFooterLangDetailCtrl Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('MailFooterLangDetailCtrl', MailFooterLangDetailCtrl);

  MailFooterLangDetailCtrl.$inject = ['$log', '$modal', '$scope', '$state', 'currentMailFooterLang', 'MailFooterLang',
    'mailFooters'];

  /**
   * @namespace MailFooterLangDetailCtrl
   * @desc Application mail footer language detail system controller
   * @memberOf linshareAdminApp
   */
  function MailFooterLangDetailCtrl($log, $modal, $scope, $state, currentMailFooterLang, MailFooterLang, mailFooters) {
    $scope.cancel = cancel;
    $scope.mailFooterLang = currentMailFooterLang;
    $scope.mailFooters = mailFooters;
    $scope.reset = reset;
    $scope.update = update;

    /**
     * @name cancel
     * @desc Cancel selection of the mail footer lang
     * @memberOf linshareAdminApp.MaillFooterLangDetailCtrl
     */
    function cancel() {
      $state.go("mailconfig.detail", {
        id: $state.params.mailConfigId,
        language: $scope.mailFooterLang.language,
        domainId: $state.params.domainId
      });
    };

    /**
     * @name reset
     * @desc Reset selection of the mail footer lang
     * @memberOf linshareAdminApp.MaillFooterLangDetailCtrl
     */
    function reset() {
      $state.reinit();
    };

    /**
     * @name update
     * @desc Update selection of the mail footer lang
     * @memberOf linshareAdminApp.MaillFooterLangDetailCtrl
     */
    function update() {
      MailFooterLang.update($scope.mailFooterLang).then(function() {
        $scope.cancel();
      });
    };
  }
})();
