'use strict';

angular.module('myApp.controllers')
  .controller('DomainPatternCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'DomainPattern',
      function ($scope, $filter, $log, ngTableParams, DomainPattern) {
        $scope.viewForm = false;
        $scope.dataset = [];
        $scope.reloadList = function () {
          DomainPattern.getAll(function(domainPatterns) {
            $scope.dataset = domainPatterns;
          });
        };
        $scope.reloadList();
        var getData = function() {
          return $scope.dataset;
        };
        $scope.$watch("dataset", function () {
          $scope.tableParams.reload();
        });         
        $scope.switchView = function() {
          $scope.viewForm = !$scope.viewForm;
        };
        $scope.resetForm = function() {
          DomainPattern.setCurrent(undefined);
        };
        $scope.edit = function(domainPattern) {
          DomainPattern.setCurrent(domainPattern);
          $scope.switchView();
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
