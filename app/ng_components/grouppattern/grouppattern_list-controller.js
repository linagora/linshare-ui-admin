'use strict';

angular.module('linshareAdminApp')
  .controller('GroupPatternListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'groupPatterns',
      function ($scope, $filter, $log, $translate, ngTableParams, groupPatterns) {
        $scope.getTemplate = function () {
          return 'GROUP_PATTERN';
        };
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 10,
          sorting: {
            label: 'asc'
          }
        }, {
            debugMode: false,
            total: 0, // length of data
            getData: function ($defer, params) {
              var orderedData = params.sorting() ?
                $filter('orderBy')(groupPatterns, params.orderBy()) :
                groupPatterns;
              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
      }]
  );
