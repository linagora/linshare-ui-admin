'use strict';

app.directive('lsThreadGrid', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      controller: ['$scope', 'localize', 'Restangular',
        function($scope, Localize, Restangular) {
          $scope.getData = function(successCallback) {
            return Restangular.all('threads').getList()
              .then(successCallback);
          };

          $scope.selections = [];
          $scope.selectedThread = {};

          $scope.$watch('selections', function(newValue, oldValue) {
            if (!_.isEmpty(newValue)) {
              angular.copy(newValue[0], $scope.selectedThread);
            } else {
              $scope.selectedUser = {};
            }
          }, true);

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.selections,
            multiSelect: false,
            keepLastSelected: false,
            showGroupPanel: true,
            enablePaging: true,
            showFooter: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            sortInfo: {
              fields: ['modificationDate'],
              directions: ['desc']
            },
            columnDefs: [{
                field: 'name',
                displayName: 'Name(TODO)',
              }, {
                field: 'modificationDate',
                displayName: 'Modification Date(TODO)',
                width: 200,
                cellFilter: "date:'dd/MM/yyyy HH:mm'"
              }
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
          };

          $scope.$on('reloadList', function() {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize,
                                     $scope.pagingOptions.currentPage);
          });
        }
      ],
      template: '<div x-ng-grid="gridOptions" style="gridStyle"></div>' +
                '<div x-ng-transclude></div>',
      replace: false
    };
  }
]);
