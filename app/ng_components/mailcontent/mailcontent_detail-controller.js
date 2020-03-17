/**
 * MailContentDetailCtrl Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('MailContentDetailCtrl', MailContentDetailCtrl);

  MailContentDetailCtrl.$injet = ['_', '$log', '$modal', '$sce', '$scope', '$state', '$translate',
    'currentDomain', 'currentMailContent', 'mailConfigs', 'mailContentRestService', 'mailLanguage', 'Notification'
  ];

  /**
   * @namespace MailContentDetailCtrl
   * @desc Controller of MailContentDetail
   * @memberOf linshareAdminApp
   */
  // TODO: Should dispatch some function to other service or controller
  /* jshint maxparams: false */
  function MailContentDetailCtrl(_, $log, $modal, $sce, $scope, $state, $translate, currentDomain,
    currentMailContent, mailConfigs, mailContentRestService, mailLanguage, Notification) {

    $scope.capitalize = capitalize;
    $scope.copy = copy;
    $scope.domain = currentDomain;
    $scope.mailConfigs = mailConfigs;
    $scope.mailContent = currentMailContent;
    $scope.mailContentContextSelected = undefined;
    $scope.mailConfigSelected = undefined;
    $scope.mailLanguage = mailLanguage;
    $scope.mailRendered = {
      data: undefined,
      lang: undefined,
      processed: undefined
    };
    $scope.remove = remove;
    $scope.render = render;
    $scope.renderShow = {};
    $scope.reset = reset;
    $scope.selectConfig = selectConfig;
    $scope.selectContext = selectContext;
    $scope.update = update;

    activate();

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.MailContentDetailCtrl
     */
    function activate() {
      mailContentRestService.getContexts($scope.mailContent.uuid).then(function(data) {
        _.forEach(data, function(contentVar, index) {
          contentVar.index = index;
        });
        $scope.mailContentContext = data;
        $scope.mailContentContextSelected = $scope.mailContentContext[0];
      });
      $scope.mailConfigSelected = mailConfigs[0];
    }

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
     * @memberOf linshareAdminApp.MailContentDetailCtrl
     */
    function copy() {
      var copyText;
      $translate('MAIL_CONTENT.BOX_FORM.TEXT_COPY').then(function(data) {
        copyText = data + ' ';
        var modalScope = $scope.$new();
        modalScope.mailContent = {};
        modalScope.mailContent.description = copyText + $scope.mailContent.description;
        modalScope.domainUuid = currentDomain.identifier;
        modalScope.mailContentType = currentMailContent.mailContentType;
        modalScope.modelUuid = currentMailContent.uuid;
        var modalInstance = $modal.open({
          controller: 'mailContentModalCtrl',
          templateUrl: 'ng_components/mailcontent/mailcontent_modal.tpl.html',
          scope: modalScope
        });
        modalInstance.result.then(function() {}).catch(function() {});
      }).catch(function(error) {
        Notification.addError(error);
      });
    }

    //TODO [TOFILL]
    function remove() {
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
          mailContentRestService.remove($scope.mailContent).then(function() {
            $state.go('mailcontent.list', {
              domainId: $scope.domain.label
            });
          });
        },
        function cancel() {
          $log.debug('Deletion modal dismissed');
        }
      );
    }

    /**
     * @name render
     * @desc Render template with value for a preview
     * @param {boolean} live - Determine if the saved template or the current edited should be used for rendering
     * @memberOf linshareAdminApp.MailContentDetailCtrl
     */
    function render(live, lang) {
      var fnCall = live ?
        mailContentRestService.buildLive(
          $scope.mailContent,
          $scope.mailConfigSelected.uuid,
          lang,
          $scope.mailContentContextSelected.index
        ) :
        mailContentRestService.build(
          $scope.mailContent.uuid,
          $scope.mailConfigSelected.uuid,
          lang,
          $scope.mailContentContextSelected.index
        );
      fnCall.then(function(data) {
        $scope.mailRendered.data = data;
        $scope.mailRendered.lang = lang;
        $scope.mailRendered.processed = $sce.trustAsHtml(data.content);
      });
    }

    //TODO [TOFILL]
    function reset() {
      $state.reinit();
    }

    /**
     * @name selectConfig
     * @desc Define the selected config
     * @param {Object} value - Config object
     * @memberOf linshareAdminApp.MailContentDetailCtrl
     */
    function selectConfig(value) {
      $scope.mailConfigSelected = value;
    }

    /**
     * @name selectContext
     * @desc Define the selected context
     * @param {Object} value - Context object
     * @memberOf linshareAdminApp.MailContentDetailCtrl
     */
    function selectContext(value) {
      $scope.mailContentContextSelected = value;
    }

    //TODO [TOFILL]
    function update() {
      mailContentRestService.update($scope.mailContent);
    }
  }
})();
