'use strict';

app.directive('gridDomainPatterns', [
  function() {
    return {
      restrict: 'A',
      // Notify that the contained elements are not remove but moved in other div (@see data-ng-transclude)
      transclude: true,
      controller: ['$scope', 'localize', 'Restangular', 'loggerService',
        function($scope, Localize, Restangular, Logger) {
          $scope.getData = function(successCallback) {
            return Restangular.all('admin').all('domain_patterns').getList()
              .then(successCallback, 
                function errorCallback(err) {
                  Logger.error('Fail to retreive domain patterns list' + err);
                });
          };

          $scope.selections = [];

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.selections,
            multiSelect: false,
            keepLastSelected: false,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            sortInfo: {
              fields: ['identifier'],
              directions: ['asc']
            },
            columnDefs: [{
                field: 'identifier',
                displayName: Localize.getLocalizedString('P_Domains-DomainPatterns_IdentifierLabel')
              }, {
                field: 'description',
                displayName: Localize.getLocalizedString('P_Domains-DomainPatterns_DescriptionLabel'),
                sortable: false
              }
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
          };

          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
      ],
      template: '<div class="gridStyle" data-ng-grid="gridOptions"></div>'+
                '<div data-ng-transclude></div>',
      // Replace the current directive's div by the template
      replace: false
    };
  }
]);
