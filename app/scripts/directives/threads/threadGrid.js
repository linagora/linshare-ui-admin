'use strict';

app.directive('lsThreadGrid', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      controller: ['$scope', '$log', 'Restangular', 'Notification', 'localize',
        function($scope, $log, Restangular, Notification, localize) {
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
            i18n: localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.selections,
            multiSelect: false,
            keepLastSelected: false,
            showGroupPanel: true,
            enablePaging: true,
	    showFilter: true,
            showFooter: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            sortInfo: {
              fields: ['modificationDate'],
              directions: ['desc']
            },
            columnDefs: [{
                field: 'name',
                displayName: localize.getLocalizedString('P_Threads-Grid_Name'),
              }, {
                field: 'modificationDate',
                displayName: localize.getLocalizedString('P_Threads-Grid_ModificationDate'),
                width: 200,
                cellFilter: "date:'dd/MM/yyyy HH:mm'"
              }, {
                field: '',
                displayName: localize.getLocalizedString('P_Threads-Grid_Actions'),
                width: 120,
                cellClass: 'ngCellText ',
                headerClass: 'ngHeaderCell ',
                cellTemplate: '<div class="btn-toobar">' +
                              '<div class="btn-group">' +
                              '<button ng-click="edit(row)" class="btn btn-mini"><i class="icon-black icon-pencil"></i> ' + localize.getLocalizedString('P_Threads-Grid_Edit') +  '</button>' +
                              '<button ng-click="delete(row)" class="btn btn-mini"><i class="icon-black icon-trash"></i>' + localize.getLocalizedString('P_Threads-Grid_Delete') +  '</button>' +
                              '</div>' +
                              '</div>'
              }
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
          };

          $scope.edit = function(row) {
            var selectedThread = row.entity;
            $log.debug('selectedThread edition: ' + selectedThread.identifier);
	    // TODO
          }

          $scope.delete = function(row) {
            var selectedThread = row.entity;
            $log.debug('selectedThread deletion: ' + selectedThread.identifier);
            selectedThread.remove().then(function success(selectedThread) {
              $scope.$broadcast('reloadList');
              Notification.addSuccess('P_Threads-Grid_DeleteSuccess');
            });
          }

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
