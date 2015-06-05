'use strict';

angular.module('linshareAdminApp')
  .controller('TechnicalAccountListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'technicalAccounts',
    function($scope, $filter, $log, $translate, ngTableParams, technicalAccounts) {
      $scope.getTemplate = function () {
        return 'TECHNICAL_ACCOUNT';
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          name: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(technicalAccounts, params.orderBy()) :
                              technicalAccounts;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

