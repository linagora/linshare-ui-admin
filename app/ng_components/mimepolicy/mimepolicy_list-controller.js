'use strict';

angular.module('linshareAdminApp')
  .controller('MimePolicyListCtrl',
    ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'currentDomain', 'mimePolicies',
    function($scope, $filter, $log, $modal, ngTableParams, currentDomain, mimePolicies) {
      $scope.domain = currentDomain;

      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mimePolicyModalCtrl',
          templateUrl: 'ng_components/mimepolicy/mimepolicy_modal.tpl.html'
        });
        modalInstance.result.then(function () {
          $scope.tableParams.reload();
        });
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
          var filteredData = params.filter() ?
                    $filter('filter')(mimePolicies, params.filter()) :
                    mimePolicies;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

