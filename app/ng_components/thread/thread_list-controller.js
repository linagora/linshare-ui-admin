'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'threads',
    function($scope, $filter, $log, ngTableParams, threads) {

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
          var orderedData = params.sorting() ?
                              $filter('orderBy')(threads, params.orderBy()) :
                              threads;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

