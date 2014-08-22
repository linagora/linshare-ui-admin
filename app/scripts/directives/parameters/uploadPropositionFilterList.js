'use strict';

angular.module('linshareAdminApp').directive('lsUploadPropositionFilterList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'UploadPropositionFilter',
        function($scope, $filter, $log, ngTableParams, UploadPropositionFilter) {
          $scope.swap = function(x, y, data) {
            data[x].order = y;
            data[y].order = x;
            UploadPropositionFilter.update(data[x], function successCallback() {
              UploadPropositionFilter.update(data[y], function successCallback() {
                $scope.reloadList();
              });
            }, false); // Disable one notify
          };
          $scope.create = function() {
            UploadPropositionFilter.setCurrent({});
          };
          $scope.edit = function(filter) {
            UploadPropositionFilter.setCurrent(filter);
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
              UploadPropositionFilter.getAll(function(filters) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(filters, params.orderBy()) :
                                    upfilters;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/parameters/uploadpropositionfilter_list.html',
      replace: false
    };
  }
]);
