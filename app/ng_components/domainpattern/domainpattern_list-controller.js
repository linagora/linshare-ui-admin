'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPatternListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'domainPatterns',
    function($scope, $filter, $log, ngTableParams, domainPatterns){

      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          identifier: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(domainPatterns, params.orderBy()) :
                              domainPatterns;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
