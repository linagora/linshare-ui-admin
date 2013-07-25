'use strict';

app.directive('gridThreads', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'localize', 'Restangular',
        function($scope, Localize, Restangular) {
          $scope.getData = function(successCallback) {
            return Restangular.all('threads').getList()
              .then(successCallback, function error(err) {
                Logger.error('Fail to retreive threads list' + err);
            });
          };

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.threadserSelections,
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
                displayName: 'Name',
                cellTemplate: '<a href="#/threads/{{row.entity[\'uuid\']}}">{{row.entity[col.field]}}</a>'
              }, {
                field: 'modificationDate',
                displayName: 'Modification Date',
                width: 200,
                cellFilter: "date:'dd/MM/yyyy HH:mm'"
              }
            ]
          };
        }
      ],
      template: '<div data-ng-grid="gridOptions" style="width: 1000px; height: 600px"></div>',
      replace: false
    };
  }
]);
