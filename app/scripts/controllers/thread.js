'use strict';

angular.module('myApp.controllers')
  .controller('ThreadCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'Thread',
      function ($scope, $filter, $log, ngTableParams, Thread) {
        $scope.reloadList = function () {
          $scope.tableParams.reload();
        };
        $scope.$watch(Thread.getCurrent, function (newValue, oldValue) {
          if (angular.isUndefined(newValue)) {
            $scope.reloadList();
          }
        });
        $scope.getCurrentThread = function() {
          return Thread.getCurrent();
        };
        $scope.edit = function(thread) {
          Thread.setCurrent(thread);
        };
        $scope.showList = function() {
          return Thread.setCurrent(undefined);
        };
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
            Thread.getAll(function(threads) {
              var orderedData = params.sorting() ?
                                  $filter('orderBy')(threads, params.orderBy()) :
                                  threads;
              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        });
      }
    ]
  );
