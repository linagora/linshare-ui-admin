'use strict';

angular.module('linshareAdminApp').directive('lsDomainList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'Domain',
        function($scope, $filter, $log, ngTableParams, Domain) {
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
              Domain.getAll(function(domains) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(domains, params.orderBy()) :
                                    domains;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'ng_components/domain/domain_list.tpl.html',
      replace: false
    };
  }
]);
