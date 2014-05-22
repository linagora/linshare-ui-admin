'use strict';

angular.module('linshareAdminApp').directive('lsMailConfigList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'Domain', 'MailConfig',
        function($scope, $filter, $log, $modal, ngTableParams, Domain, MailConfig) {
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
              controller: 'mailConfigModalCtrl',
              templateUrl: 'views/templates/parameters/mailconfig_modal.html'
            });
          };
          $scope.edit = function(mailConfig) {
            MailConfig.setCurrent(mailConfig);
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
              MailConfig.getAll($scope.domain, function(mailConfigs) { 
                var orderedData = params.sorting() ?
                          $filter('orderBy')(mailConfigs, params.orderBy()) :
                          mailConfigs;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/parameters/mailconfig_list.html',
      replace: false
    };
  }
]);
