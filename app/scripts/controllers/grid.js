'use strict';

app.controller('GridCtrl', ['$scope', 'loggerService',
  function($scope, Logger) {
    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: false
    };

    $scope.pagingOptions = {
      pageSizes: [250, 500, 1000],
      pageSize: 250,
      totalServerItems: 0,
      currentPage: 1
    };

    // Build one page
    $scope.setPagingData = function(data, page, pageSize) {
      var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.myData = pagedData;
      $scope.pagingOptions.totalServerItems = data.length;

      // Test if the controller is synchronized with the view and otherwise we push
      // the data to the view.
      // Force to reload the to way data binding manually
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    // Retreive datas from server
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
      setTimeout(function() {
        var data;
        if (searchText) {
          var ft = searchText.toLowerCase();
          $scope.getData(function(datas) {
            data = datas.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            $scope.setPagingData(data, page, pageSize);
          });
        } else {
          $scope.getData(function(datas) {
            $scope.setPagingData(datas, page, pageSize);
          });
        }
      }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
      if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);
  }
]);
