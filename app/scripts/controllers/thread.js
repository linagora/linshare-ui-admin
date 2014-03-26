'use strict';

angular.module('myApp.controllers')
  .controller('ThreadCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'Thread',
      function ($scope, $filter, $log, ngTableParams, Thread) {
        var getData = function() {
          return $scope.dataset;
        };

        $scope.dataset = [];
        $scope.reloadList = function () {
          Thread.getAll(function(threads) {
            $scope.dataset = threads;
          });
        };
        $scope.reloadList();
        $scope.$watch('dataset', function () {
          $scope.tableParams.reload();
        });
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
        }, {
          debugMode: false,
          total: function () { return getData().length; }, // length of data
          getData: function($defer, params) {
            var filteredData = getData();
            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                filteredData;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          $scope: { $data: {} }
        });
      }
    ]
  );
