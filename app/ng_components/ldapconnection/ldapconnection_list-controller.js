'use strict';

angular.module('linshareAdminApp')
  .controller('LdapConnectionListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'ldapConnections',
    function($scope, $filter, $log, $translate, ngTableParams, ldapConnections){
      $scope.getTemplate = function() {
        return 'LDAP_CONNECTION';
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          label: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(ldapConnections, params.orderBy()) :
                              ldapConnections;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

