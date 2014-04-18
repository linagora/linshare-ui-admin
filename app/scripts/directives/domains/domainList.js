'use strict';

angular.module('linshareAdminApp').directive('lsDomainList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'Domain',
        function($scope, $filter, $log, ngTableParams, Domain) {
          Domain.getAll(function(domains) {
            $scope.domains = domains;
            $scope.reloadList();
          });
          $scope.swap = function(x, y) {
            var domains = $scope.domains;
            var tmp = domains[x].authShowOrder;
            domains[x].authShowOrder = domains[y].authShowOrder;
            domains[y].authShowOrder = tmp;
            Domain.update(domains[x], function successCallback() {
              Domain.update(domains[y], function successCallback() {
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
              if (angular.isDefined($scope.domains)) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.domains, params.orderBy()) :
                                    $scope.domains;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
            }
          });
        }
      ],
      templateUrl: '/views/templates/domains/domain_list.html',
      replace: false
    };
  }
]);
