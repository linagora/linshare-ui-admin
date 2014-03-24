'use strict';

app.directive('lsThreadMemberGrid', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$routeParams', '$log', 'Restangular', 'localize',
        function($scope, $routeParams, $log, Restangular, localize) {
          $scope.getData = function(successCallback) {
            return Restangular.one('threads', $routeParams.threadId).getList('members')
              .then(successCallback);
          };

          $scope.gridOptions = {
            i18n: localize.getSimpleLanguage(),
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
