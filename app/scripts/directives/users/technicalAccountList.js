'use strict';

angular.module('linshareAdminApp').directive('lsTechnicalAccountList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$filter', '$log', 'ngTableParams', 'TechnicalAccount',
        function($scope, $filter, $log, ngTableParams, TechnicalAccount) {
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.$watch(TechnicalAccount.getCurrent, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              $scope.reloadList();
            }
          });
          $scope.edit = function(technicalAccount) {
            TechnicalAccount.setCurrent(technicalAccount);
          };
          $scope.create = function() {
            TechnicalAccount.setCurrent({});
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              name: 'asc'
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              TechnicalAccount.getAll(function(technicalAccounts) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(technicalAccounts, params.orderBy()) :
                                    technicalAccounts;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/users/technical_account_list.html',
      replace: false
    };
  }
]);
