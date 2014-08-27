'use strict';

angular.module('linshareAdminApp').directive('lsMailLayoutList', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'Domain', 'MailLayout',
        function($scope, $filter, $log, $modal, ngTableParams, Domain, MailLayout) {
          $scope.$watch(Domain.getCurrent,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.domain = newValue;
                $scope.tableParams.reload();
              }
            },
            true
          );
          $scope.add = function() {
            var modalInstance = $modal.open({
              controller: 'mailLayoutModalCtrl',
              templateUrl: 'ng_components/maillayout/maillayout_modal.tpl.html'
            });
          };
          $scope.edit = function(mailLayout) {
            MailLayout.setCurrent(mailLayout);
          };
          $scope.cancel = function() {
            Domain.setCurrent(undefined);
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              name: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              MailLayout.getAll(Domain.getCurrentId(), true,  function(mailLayouts) { 
                var orderedData = params.sorting() ?
                          $filter('orderBy')(mailLayouts, params.orderBy()) :
                          mailLayouts;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'ng_components/maillayout/maillayout_list.tpl.html',
      replace: false
    };
  }
]);
