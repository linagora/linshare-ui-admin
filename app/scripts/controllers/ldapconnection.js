'use strict';

angular.module('myApp.controllers')
  .controller('LdapConnectionCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'LdapConnection',
      function ($scope, $filter, $log, ngTableParams, LdapConnection) {
        $scope.viewForm = false;
        $scope.dataset = [];
        $scope.reloadList = function () {
          LdapConnection.getAll(function(ldapConnections) {
            $scope.dataset = ldapConnections;
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
          LdapConnection.setCurrent(undefined);
        };
        $scope.edit = function(ldapConnection) {
          LdapConnection.setCurrent(ldapConnection);
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
