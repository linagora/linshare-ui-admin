'use strict';

app.directive('gridThreadMembers', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$routeParams', 'localize', 'Restangular', 'loggerService',
        function($scope, $routeParams, Localize, Restangular, Logger) {
          $scope.getData = function(successCallback) {
            return Restangular.one('threads', $routeParams.threadId).getList('members')
              .then(successCallback, function error(err) {
                Logger.error('Fail to retreive thread members list' + err);
            });
          };

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.threadSelections,
            displayFooter: false,
            displaySelectionCheckbox: false,
            multiSelect: false,
            selectWithCheckboxOnly: true,
            showGroupPanel: false,
            enablePaging: false,
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'firstName',
                displayName: 'First Name',
                width: 90
              }, {
                field: 'lastName',
                displayName: 'Last Name',
                width: 90
              }, {
                field: 'admin',
                cellClass: 'roleCell',
                cellTemplate: '<span>{{row.entity[col.field]}}{{row.entity[\'canUpload\']}}</span>',
                cellFilter: 'role'
              }
            ]
          };
        }
      ],
      template: '<h4>Thread Members</h4><div data-ng-grid="gridOptions" style="width: 250px; height: 300px"></div>',
      replace: false
    };
  }
]);
