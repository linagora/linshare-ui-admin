'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigDetailCtrl',
    ['_', '$filter', '$log', '$modal', '$scope', '$state', '$translate', 'currentDomain', 'currentMailConfig',
      'MailConfig', 'MailFooterLang', 'mailFooterLangs', 'mailLayouts', 'ngTableParams', 'Notification',
    // TODO: Should dispatch some function to other service or controller
    /* jshint maxparams: false */
    function(_, $filter, $log, $modal, $scope, $state, $translate, currentDomain, currentMailConfig, MailConfig,
             MailFooterLang, mailFooterLangs, mailLayouts, ngTableParams, Notification) {
      $scope.domain = currentDomain;
      $scope.mailConfig = currentMailConfig;
      $scope.mailLayouts = mailLayouts;
      $scope.mailFooterLangs = mailFooterLangs;
      $scope.copy = copy;

      /**
       * @name addMailContentTypeTranslation
       * @desc Add a a new propertie on MailContent to get the translation of the type
       * @memberOf linshareAdminApp.MailConfigDetailCtrl
       */
      function addMailContentTypeTranslation() {
        _.forEach($scope.mailConfig.mailContentLangs, function(mailContentLang) {
          $translate('COMMON.ENUM.MAIL_CONTENT_TYPE.' + mailContentLang.mailContentType).then(function(data) {
            mailContentLang.mailContentTypeTranslated = data;
          }).catch(function() {
            mailContentLang.mailContentTypeTranslated = '';
          });
        });
      }

      /**
       * @name copy
       * @desc Copy a mail content
       * @memberOf linshareAdminApp.MailConfigDetailCtrl
       */
      function copy() {
        var copyText;
        $translate('MAIL_FOOTER.BOX_FORM.TEXT_COPY').then(function(data) {
          copyText = data + ' ';
          var modalScope = $scope.$new();
          modalScope.mailConfig = {};
          modalScope.mailConfig.name = copyText + $scope.mailConfig.name;
          modalScope.domainUuid = currentDomain.identifier;
          modalScope.modelUuid = currentMailConfig.uuid;
          $modal.open({
            controller: 'mailConfigModalCtrl',
            templateUrl: 'ng_components/mailconfig/mailconfig_modal.tpl.html',
            scope: modalScope
          });
        }).catch (function(error) {
          Notification.addError(error);
        });
      }

      /**
       * @name removeMailContentTypeTranslation
       * @desc Remove the propertie mailContentTypeTranslated of MailContent
       * @memberOf linshareAdminApp.MailConfigDetailCtrl
       */
      function removeMailContentTypeTranslation() {
        _.forEach($scope.mailConfig.mailContentLangs, function(mailContentLang) {
            delete mailContentLang.mailContentTypeTranslated;
        });
      }

      $scope.remove = function() {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'MAIL_CONFIG.CONFIRM_DELETE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            removeMailContentTypeTranslation();
            MailConfig.remove($scope.mailConfig).then(function() {
              $state.go('mailconfig.list', {domainId: $scope.domain.label});
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function(redirect) {
        removeMailContentTypeTranslation();
        MailConfig.update($scope.mailConfig).then(function() {
          if (redirect) {
            $state.go('mailconfig.list', {domainId: $scope.domain.label});
          }
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.editMailContentLang = function(mailContentLang) {
        $state.go('mailconfig.detail', {domainId: $state.params.domainId, contentLangId: mailContentLang.uuid});
      };
      $scope.updateMailFooterLang = function(mailFooterLang) {
        MailFooterLang.update(mailFooterLang);
      };
      $scope.tableFooterParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,
        count: 10,
        sorting: {
          language: 'asc'
        }
      }, {
        debugMode: false,
        total: 0,
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                  $filter('orderBy')(_.values($scope.mailConfig.mailFooterLangs), params.orderBy()) :
                  _.values($scope.mailConfig.mailFooterLangs);
          orderedData = params.filter ?
                  $filter('filter')(orderedData, params.filter()) : orderedData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

      addMailContentTypeTranslation();
      $scope.tableContentParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          mailContentType: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.mailConfig.mailContentLangs, params.orderBy()) :
                  $scope.mailConfig.mailContentLangs;
          orderedData = params.filter ?
                  $filter('filter')(orderedData, params.filter()) : orderedData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

