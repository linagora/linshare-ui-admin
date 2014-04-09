'use strict';

app.directive('lsAuditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller:
        ['$scope', '$log', 'ngTableParams', 'Domain', 'Audit',
        function($scope, $log, ngTableParams, Domain, Audit) {
          $scope.criteria = {};
          $scope.allActions = [];
          $scope.allDomains = [];
          //Audit.getAllActions(function successCallback(actions) {
          //});
          Domain.getAll(function successCallback(domains) {
            $scope.allDomains = domains;
          });
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              actionDate: 'asc'
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              Audit.query($scope.criteria, function successCallback(logs) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(logs, params.orderBy()) :
                                    logs;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: '/views/templates/history/audit_form.html',
      replace: false
    };
  }
]);

