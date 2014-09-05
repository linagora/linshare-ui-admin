'use strict';

angular.module('linshareAdminApp')
  .controller('MailLayoutListCtrl',
    ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'mailLayouts', 'currentDomain',
    function($scope, $filter, $log, $modal, ngTableParams, mailLayouts, currentDomain) {
      $scope.domain = currentDomain;

      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mailLayoutModalCtrl',
          templateUrl: 'ng_components/maillayout/maillayout_modal.tpl.html'
        });
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
          var orderedData = params.sorting() ?
                    $filter('orderBy')(mailLayouts, params.orderBy()) :
                    mailLayouts;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );


