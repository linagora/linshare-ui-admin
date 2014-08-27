'use strict';

angular.module('linshareAdminApp').directive('lsMimePolicyList', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'Domain', 'MimePolicy',
        function($scope, $filter, $log, $modal, ngTableParams, Domain, MimePolicy) {
          $scope.$watch(Domain.getCurrent,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.domain = newValue;
                $scope.tableParams.reload();
              }
            },
            true
          );
          $scope.add = function() {
            var modalInstance = $modal.open({
              controller: 'mimePolicyModalCtrl',
              templateUrl: 'ng_components/mimepolicy/mimepolicy_modal.tpl.html'
            });
            modalInstance.result.then(function () {
              $scope.tableParams.reload();
            });
          };
          $scope.edit = function(mimePolicy) {
            MimePolicy.get(mimePolicy.uuid, true, function(m) {
              MimePolicy.setCurrent(m);
            });
          };
          $scope.cancel = function() {
            Domain.setCurrent(undefined);
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              name: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              MimePolicy.getAll(Domain.getCurrentId(), true, function(mimePolicies) { 
                var filteredData = params.filter() ?
                          $filter('filter')(mimePolicies, params.filter()) :
                          mimePolicies;
                var orderedData = params.sorting() ?
                          $filter('orderBy')(filteredData, params.orderBy()) :
                          filteredData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'ng_components/mimepolicy/mimepolicy_list.tpl.html',
      replace: false
    };
  }
]);
