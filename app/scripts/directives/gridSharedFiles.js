'use strict';

app.directive('gridSharedFiles', [
  function() {
    return {
      restrict: 'A',
      // Notify that the contained elements are not remove but moved in other div (@see data-ng-transclude)
      transclude: true,
      // Create new scope for the current directive
      scope: false,
      controller: ['$scope', '$rootScope', 'localize', 'shareService',
        function($scope, $rootScope, Localize, Share) {
          $scope.getData = function(successCallback, errorCallback) {
            return Share.query(successCallback, errorCallback);
          };

          $rootScope.mySelections = [];

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $rootScope.mySelections,
            showGroupPanel: true,
            enablePaging: true,
            showFooter: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            sortInfo: {
              fields: ['creationDate'],
              directions: ['desc']
            },
            columnDefs: [{
                field: 'name',
                displayName: 'File Name'
              }, {
                field: 'creationDate',
                displayName: 'Creation date',
                cellFilter: "date:'dd/MM/yyyy HH:mm'"
              }
            ]
          };
        }
      ],
      template: '<div class="row" data-ng-grid="gridOptions" style="width: 1000px; height: 400px"></div>' + 
                '<div data-ng-transclude></div>',
      // Replace the div with the current directive by the template
      replace: false
    };
  }
]);
