'use strict';

angular.module('linshareAdminApp').directive('lsMimePolicyForm', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$filter', '$timeout', '$log', '$modal', 'ngTableParams', 'Domain', 'MimePolicy', 'MimeType',
        function($scope, $filter, $timeout, $log, $modal, ngTableParams, Domain, MimePolicy, MimeType) {
          $scope.$watch(MimePolicy.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.reset();
              }
            }
          );
          $scope.remove = function() {
            var modalInstance = $modal.open({
              templateUrl: 'views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return 'MIME_POLICIES.CONFIRM_DELETE_FORM.PARAGRAPH';
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                MimePolicy.remove($scope.mimePolicy,
                  function successCallback() {
                    $scope.cancel();
                  }
                );
              }, function cancel() {
                $log.debug('Deletion modal dismissed');
              }
            );
          };
          $scope.iconSaved = false;
          $scope.displayIconSaved = function() {
            $scope.iconSaved = true;
            $timeout(function() {
              $scope.iconSaved = false;
            }, 800);
          };
          $scope.update = function() {
            MimePolicy.update($scope.mimePolicy, function() {
              $scope.cancel();
            });
          };
          $scope.updateMimeType = function(mimeType) {
            MimeType.update(mimeType, function() {
              $scope.displayIconSaved();
            });
          };
          $scope.enableAllMimeTypes = function(mimeConfig) {
            MimePolicy.enableAllMimeTypes(mimeConfig.uuid, function(mimePolicy) {
              MimePolicy.setCurrent(mimePolicy);
              $scope.displayIconSaved();
              $scope.reset();
            });
          };
          $scope.disableAllMimeTypes = function(mimeConfig) {
            MimePolicy.disableAllMimeTypes(mimeConfig.uuid, function(mimePolicy) {
              MimePolicy.setCurrent(mimePolicy);
              $scope.displayIconSaved();
              $scope.reset();
            });
          };
          $scope.cancel = function() {
            MimePolicy.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.mimePolicy = MimePolicy.copyCurrent();
            $scope.tableParams.reload();
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              enable: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              if (angular.isDefined($scope.mimePolicy)) {
                var filteredData = params.filter() ?
                          $filter('filter')($scope.mimePolicy.mimeTypes, params.filter()) :
                          $scope.mimePolicy.mimeTypes;
                var orderedData = params.sorting() ?
                          $filter('orderBy')(filteredData, params.orderBy()) :
                          filteredData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
            },
            $scope: { $data: {}, $emit: function() {} }
          });
        }
      ],
      templateUrl: 'views/templates/parameters/mimepolicies_form.html',
      replace: false
    };
  }
]);
