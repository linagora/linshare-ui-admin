'use strict';

angular.module('linshareAdminApp')
  .controller('UploadPropositionFilterListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'UploadPropositionFilter', 'uploadPropositionFilters',
    function($scope, $filter, $log, $translate, ngTableParams, UploadPropositionFilter, uploadPropositionFilters) {
      $scope.getTemplate = function () {
        return 'UPLOAD_PROPOSITION_FILTERING';
      };
      $scope.swap = function(x, y, data) {
        data[x].order = y;
        data[y].order = x;
        UploadPropositionFilter.update(data[x], false).then(function() { // Disable one notify
          UploadPropositionFilter.update(data[y]).then(function() {
            $scope.reloadList();
          });
        });
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
          $scope.isCollapsed = (orderedData.length == 0) ? true : false;
        }
      });
    }]
  );
