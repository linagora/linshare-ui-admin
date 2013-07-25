'use strict';

app.directive('gridUsers', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'localize', 'Restangular',
        function($scope, Localize, Restangular) {
          $scope.getData = function(successCallback) {
            return Restangular.all('users').getList()
              .then(successCallback, function error() {
                Logger.error('Fail to retreive users list' + err);
            });
          };

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.userSelections,
            showGroupPanel: true,
            enablePaging: true,
            showFooter: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                width: 90,
                cellTemplate: '<a href="#/users/{{row.entity[\'uuid\']}}">{{row.entity[col.field]}}</a>'
              }, {
                field: 'lastName',
                displayName: 'Last Name',
                width: 90
              }, {
                field: 'mail',
                cellClass: 'mailCell',
                headerClass: 'mailHeader'
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
