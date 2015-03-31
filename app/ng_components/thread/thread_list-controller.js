'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadListCtrl',
    ['$scope', '$filter', '$log', '$state', '$location', 'ngTableParams', 'Thread',
    function($scope, $filter, $log, $state, $location, ngTableParams, Thread) {
      var canRequest = false;
      if ($state.params.search) {
        $scope.threadSearch = $state.params.search;
        canRequest = true;
      }
      $scope.isClicked = function(){
        $location.search('search', $scope.threadSearch);
        canRequest = true;
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          name: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          if (canRequest) {
            Thread.getAll($scope.threadSearch).then(function(thread) {
              thread = params.sorting() ?
                $filter('orderBy')(thread, params.orderBy()) :
                thread;
              params.total(thread.length);
              $defer.resolve(thread.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        }
      });

    }]
  );

