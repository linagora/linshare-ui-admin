'use strict';

angular.module('linshareAdminApp')
  .controller('DomainOrderCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'Domain', 'domains',
    function($scope, $filter, $log, $translate, ngTableParams, Domain, domains) {
      $scope.getTemplate = function() {
        return 'DOMAIN_ORDER';
      };
      $scope.swap = function(x, y, data) {
        data[x].authShowOrder = y;
        data[y].authShowOrder = x;
        Domain.update(data[x], false).then(function() { // Disable one notify
          Domain.update(data[y]).then(function() {
            $scope.reloadList();
          });
        });
      };
      $scope.reloadList = function() {
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
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
