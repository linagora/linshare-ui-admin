'use strict';

angular.module('linshareAdminApp').directive('lsMailContentList', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'Domain', 'MailContent',
        function($scope, $filter, $log, $modal, ngTableParams, Domain, MailContent) {
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
              controller: 'mailContentModalCtrl',
              templateUrl: 'ng_components/mailcontent/mailcontent_modal.tpl.html'
            });
          };
          $scope.edit = function(mailContent) {
            MailContent.setCurrent(mailContent);
          };
          $scope.cancel = function() {
            Domain.setCurrent(undefined);
          };
          $scope.filters = {
            language: 'ENGLISH'
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
              MailContent.getAll(Domain.getCurrentId(), true, function(mailContents) { 
                var filteredData = params.filter() ?
                          $filter('filter')(mailContents, params.filter()) :
                          mailContents;
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
      templateUrl: 'ng_components/mailcontent/mailcontent_list.tpl.html',
      replace: false
    };
  }
]);
