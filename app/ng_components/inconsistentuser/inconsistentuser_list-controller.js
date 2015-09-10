'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'allInconsistents',
    function($scope, $filter, $log, $translate, ngTableParams, allInconsistents) {
      $scope.isCollapsed = true;
      $scope.getTemplate = function () {
        return 'INCONSISTENT_USER';
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          lastName: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(allInconsistents, params.orderBy()) :
                              allInconsistents;
          orderedData = $filter('filter')(orderedData, params.filter());
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
