'use strict';

angular.module('linshareAdminApp')
  .controller('MailingListListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'mailingLists',
    function($scope, $filter, $log, ngTableParams, mailingLists) {
      $scope.isCollapsed = true;
      $scope.getTemplate = function() {
        return 'MAILINGLIST';
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          identifier: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(mailingLists, params.orderBy()) :
                              mailingLists;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
