'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'Thread',
    function($scope, $filter, $log, ngTableParams, Thread) {
      $scope.$watch('threadSearch', function(newValue){
        if(newValue) $scope.searchEntry = newValue;
        else $scope.searchEntry = null;
      });
      var canRequest = false;
      $scope.isClicked = function(){
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
            Thread.getAll($scope.searchEntry).then(function(thread) {
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

