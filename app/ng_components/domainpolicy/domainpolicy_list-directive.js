'use strict';

angular.module('linshareAdminApp').directive('lsDomainPolicyList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$filter', '$log', 'ngTableParams', 'DomainPolicy',
        function($scope, $filter, $log, ngTableParams, DomainPolicy) {
          $scope.$watch(DomainPolicy.getCurrent, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              $scope.reloadList();
            }
          });
          $scope.edit = function(domainPolicy) {
            DomainPolicy.setCurrent(domainPolicy);
          };
          $scope.create = function() {
            DomainPolicy.setCurrent({});
          };
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              identifier: 'asc'
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              DomainPolicy.getAll(function(domainPolicies) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(domainPolicies, params.orderBy()) :
                                    domainPolicies;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'ng_components/domainpolicy/domainpolicy_list.tpl.html',
      replace: false
    };
  }
]);
