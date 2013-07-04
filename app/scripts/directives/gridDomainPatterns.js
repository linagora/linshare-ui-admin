'use strict';

app.directive('gridDomainPatterns', [
  function() {
    return {
      restrict: 'A',
      // Notify that the contained elements are not remove but moved in other div (@see data-ng-transclude)
      transclude: true,
      // Create new scope for the current directive
      scope: false,
      controller: ['$scope', 'localize', 'Restangular',
        function($scope, Localize, Restangular) {
          $scope.getData = function(successCallback, errorCallback) {
            return Restangular.all('admin').all('domain_patterns').getList().then(successCallback, errorCallback);
          };

          $scope.mySelections = [];

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.mySelections,
            multiSelect: false,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            sortInfo: {
              fields: ['identifier'],
              directions: ['asc']
            },
            columnDefs: [{
                field: 'identifier',
                displayName: Localize.getLocalizedString('P_Domains-DomainsPatterns_HeaderIdentifier')
              }, {
                field: 'description',
                displayName: Localize.getLocalizedString('P_Domains-DomainsPatterns_HeaderDescription')
              }
            ]
          };
        }
      ],
      template: '<div class="gridStyle" data-ng-grid="gridOptions"></div>' + 
                '<div data-ng-transclude></div>',
      // Replace the div with the current directive by the template
      replace: false
    };
  }
]);
