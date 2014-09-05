'use strict';

angular.module('linshareAdminApp')
  .controller('DomainOrderCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'Domain', 'domains',
    function($scope, $filter, $log, ngTableParams, Domain, domains) {
      $scope.swap = function(x, y, data) {
        data[x].authShowOrder = y;
        data[y].authShowOrder = x;
        Domain.update(data[x], function successCallback() {
          Domain.update(data[y], function successCallback() {
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
          authShowOrder: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(domains, params.orderBy()) :
                              domains;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
