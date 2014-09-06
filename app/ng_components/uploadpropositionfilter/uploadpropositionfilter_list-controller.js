'use strict';

angular.module('linshareAdminApp')
  .controller('UploadPropositionFilterListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'uploadPropositionFilters',
    function($scope, $filter, $log, ngTableParams, uploadPropositionFilters) {

      $scope.swap = function(x, y, data) {
        data[x].order = y;
        data[y].order = x;
        UploadPropositionFilter.update(data[x]).then(function() {
          UploadPropositionFilter.update(data[y]).then(function() {
            $scope.reloadList();
          });
        }, false); // Disable one notify
      };
      $scope.reloadList = function () {
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          order: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(uploadPropositionFilters, params.orderBy()) :
                              uploadPropositionFilters;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
