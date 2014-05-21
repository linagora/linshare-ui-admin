'use strict';

angular.module('linshareAdminApp').directive('lsMailFooterList', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'Domain', 'MailFooter',
        function($scope, $filter, $log, $modal, ngTableParams, Domain, MailFooter) {
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
              controller: 'mailFooterModalCtrl',
              templateUrl: 'views/templates/parameters/mailfooter_modal.html'
            });
          };
          $scope.edit = function(mailFooter) {
            MailFooter.setCurrent(mailFooter);
          };
          $scope.cancel = function() {
            Domain.setCurrent(undefined);
          };
          $scope.filters = {
            language: 0
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            filter: $scope.filters,
            sorting: {
              name: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              MailFooter.getAll($scope.domain, function(mailFooters) { 
                var filteredData = params.filter() ?
                          $filter('filter')(mailFooters, params.filter()) :
                          mailFooters;
                var orderedData = params.sorting() ?
                          $filter('orderBy')(filteredData, params.orderBy()) :
                          filteredData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/parameters/mailfooter_list.html',
      replace: false
    };
  }
]);
