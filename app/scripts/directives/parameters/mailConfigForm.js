'use strict';

angular.module('linshareAdminApp').directive('lsMailConfigForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'MailConfig', 'MailContentLang', 'MailFooterLang', 'MailLayout',
        function($scope, $filter, $log, $modal, ngTableParams, MailConfig, MailContentLang, MailFooterLang, MailLayout) {
          $scope.$watch(MailConfig.getCurrent,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.reset();
              }
            },
            true
          );
          $scope.$watch(MailContentLang.getCurrent,
            function(newValue, oldValue) {
              // if we come from  mailContentLangForm
              if (angular.isUndefined(newValue) && angular.isDefined(oldValue)) {
                // Reload mail config to update mail content lang list
                MailConfig.get($scope.mailConfig.domain, $scope.mailConfig.uuid, function(mailConfig) {
                  $scope.mailConfig = mailConfig;
                  $scope.tableParams.reload();
                });
              }
            },
            true
          );
          $scope.remove = function() {
            var modalInstance = $modal.open({
              templateUrl: 'views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return 'MAIL_CONFIG.CONFIRM_DELETE_FORM.PARAGRAPH';
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                MailConfig.remove($scope.mailConfig,
                  function successCallback() {
                    $scope.cancel();
                  }
                );
              }, function cancel() {
                $log.debug('Deletion modal dismissed');
              }
            );
          };
          $scope.update = function(redirect) {
            MailConfig.update($scope.mailConfig, function() {
              if (redirect) {
                $scope.cancel();
              }
            });
          };
          $scope.cancel = function() {
            MailConfig.setCurrent(undefined);
            MailContentLang.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mailConfig = MailConfig.copyCurrent();
            MailLayout.getAll($scope.mailConfig.domain, false, function(mailLayouts) {
              $scope.mailLayouts = mailLayouts;
            });
          };
          $scope.editMailContentLang = function(mailContentLang) {
            MailContentLang.get(mailContentLang.uuid, function(mailContentLang){
              MailContentLang.setCurrent(mailContentLang);
            })
          };
          $scope.updateMailFooterLang = function(mailFooterLang) {
            MailFooterLang.update(mailFooterLang)
          };
          $scope.filters = {
            language: 'ENGLISH'
          };
          $scope.$watch('filters.language',
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                MailConfig.getAllMailFooters(newValue, function(mailFooterLangs) {
                  $scope.mailFooterLangs = mailFooterLangs;
                });
              }
            },
            true
          );
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            filter: $scope.filters,
            sorting: {
              mailContentName: 'asc',
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
        }
      ],
      templateUrl: 'views/templates/parameters/mailconfig_form.html',
      replace: false
    };
  }
]);
