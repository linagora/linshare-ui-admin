'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPolicyListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'domainPolicies',
    function($scope, $filter, $log, ngTableParams, domainPolicies) {
      $scope.getTemplate = function () {
        return 'DOMAIN_POLICY';
      };
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
                              $filter('orderBy')(domainPolicies, params.orderBy()) :
                              domainPolicies;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

