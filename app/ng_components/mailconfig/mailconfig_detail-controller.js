'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigDetailCtrl',
    ['$scope', '$filter', '$log', '$modal',  '$state', 'ngTableParams', 'MailConfig', 'currentDomain', 'currentMailConfig', 'mailLayouts', 'mailFooterLangs',
    function($scope, $filter, $log, $modal, $state, ngTableParams, MailConfig, currentDomain, currentMailConfig, mailLayouts, mailFooterLangs) {
      $scope.domain = currentDomain;
      $scope.mailConfig = currentMailConfig;
      $scope.mailLayouts = mailLayouts;
      $scope.mailFooterLangs = mailFooterLangs;

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
            MailConfig.remove($scope.mailConfig).then(function() {
              $scope.cancel();
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.update = function(redirect) {
        MailConfig.update($scope.mailConfig).then(function() {
          if (redirect) {
            $scope.cancel();
          }
        });
      };
      $scope.cancel = function() {
        $state.go("mailconfig.list", {domainId: $state.params.domainId});
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.editMailContentLang = function(mailContentLang) {
        $state.go('mailconfig.detail', {domainId: $state.params.domainId, contentLangId: mailContentLang.uuid});
      };
      $scope.updateMailFooterLang = function(mailFooterLang) {
        MailFooterLang.update(mailFooterLang)
      };
      $scope.filters = {
        language: $state.params.language
      };
      $scope.$watch('filters.language',
        function(newValue) {
          $state.go('.', {domainId: $state.params.domainId, language: newValue});
        }
      );
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        filter: $scope.filters,
        sorting: {
          mailContentName: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
                    $filter('filter')($scope.mailConfig.mailContentLangs, params.filter()) :
                    $scope.mailConfig.mailContentLangs;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

