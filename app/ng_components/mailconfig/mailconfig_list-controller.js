'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigListCtrl',
    ['$scope', '$filter', '$log', '$modal', 'ngTableParams', 'mailConfigs', 'currentDomain',
    function($scope, $filter, $log, $modal, ngTableParams, mailConfigs, currentDomain) {
      $scope.domain = currentDomain;

      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mailConfigModalCtrl',
          templateUrl: 'ng_components/mailconfig/mailconfig_modal.tpl.html'
        });
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
          var orderedData = params.sorting() ?
                    $filter('orderBy')(mailConfigs, params.orderBy()) :
                    mailConfigs;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

