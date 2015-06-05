'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadListCtrl',
    ['$scope', '$filter', '$log', '$state', '$location', '$translate', 'ngTableParams', 'Thread',
    function($scope, $filter, $log, $state, $location, $translate, ngTableParams, Thread) {
      $scope.isCollapsed = true;
      $scope.getTemplate = function () {
        return 'THREADS';
      };
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
              var filteredData = params.filter() ?
                        $filter('filter')(thread, params.filter()) : thread;

              var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        }
      });

    }]
  );

