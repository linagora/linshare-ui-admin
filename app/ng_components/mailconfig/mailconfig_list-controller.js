'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigListCtrl',
    ['$scope', '$state', '$filter', '$log', '$modal', '$translate', 'ngTableParams', 'MailConfig', 'mailConfigs', 'currentDomain',
    function($scope, $state, $filter, $log, $modal, $translate, ngTableParams, MailConfig, mailConfigs, currentDomain) {
      $scope.domain = currentDomain;
      $scope.getTemplate = function () {
        return 'MAIL_CONFIG';
      };
      $scope.delete = function (_mailConfig) {
        MailConfig.remove(_mailConfig).then(function() {
          $state.reinit();
        });
      };
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
          orderedData = params.filter ?
                $filter('filter')(orderedData, params.filter()) : orderedData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

