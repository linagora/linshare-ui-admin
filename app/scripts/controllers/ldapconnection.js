'use strict';

angular.module('myApp.controllers')
  .controller('LdapConnectionCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'LdapConnection',
      function ($scope, $filter, $log, ngTableParams, LdapConnection) {
        $scope.viewForm = false;
        $scope.reloadList = function () {
          $scope.tableParams.reload();
        };
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
          total: 0, // length of data
          getData: function($defer, params) {
            LdapConnection.getAll(function(ldapConnections) {
              var orderedData = params.sorting() ?
                                  $filter('orderBy')(ldapConnections, params.orderBy()) :
                                  ldapConnections;
              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        });
      }
    ]
  );
