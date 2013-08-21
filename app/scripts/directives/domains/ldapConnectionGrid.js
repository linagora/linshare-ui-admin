'use strict';

app.directive('lsLdapConnectionGrid', [
  function() {
    return {
      restrict: 'A',
      // Notify that the contained elements are not remove but moved in other div (@see data-ng-transclude)
      transclude: true,
      controller: ['$scope', 'localize', 'Restangular', 'loggerService',
        function($scope, Localize, Restangular, Logger) {
          $scope.getData = function(successCallback) {
            return Restangular.all('ldap_connections').getList()
              .then(successCallback);
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
                displayName: Localize.getLocalizedString('P_Domains-LDAPConnections_IdentifierLabel')
              }, {
                field: 'providerUrl',
                displayName: Localize.getLocalizedString('P_Domains-LDAPConnections_ProviderURLLabel'),
                sortable: false
              }
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
          };

          $scope.$on('reloadList', function() {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
          });
        }
      ],
      template: '<div class="gridStyle" data-ng-grid="gridOptions"></div>'+
                '<div data-ng-transclude></div>',
      // Replace the current directive's div by the template
      replace: false
    };
  }
]);
