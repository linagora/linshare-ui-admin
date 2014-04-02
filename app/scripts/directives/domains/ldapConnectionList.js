'use strict';

app.directive('lsLdapConnectionList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$filter', '$log', 'ngTableParams', 'LdapConnection',
        function($scope, $filter, $log, ngTableParams, LdapConnection) {
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.$watch(LdapConnection.getCurrent, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              $scope.reloadList();
            }
          });
          $scope.edit = function(ldapConnection) {
            LdapConnection.setCurrent(ldapConnection);
          };
          $scope.create = function() {
            LdapConnection.setCurrent({});
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
      ],
      templateUrl: '/views/templates/domains/ldap_connection_list.html',
      replace: false
    };
  }
]);
