'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterListCtrl',
    ['$filter', '$log', '$modal', '$scope', '$state', '$translate', 'currentDomain', 'ngTableParams', 'MailFooter',
      'mailFooters',
    function($filter, $log, $modal, $scope, $state, $translate, currentDomain, ngTableParams, MailFooter,
      mailFooters) {
      $scope.domain = currentDomain;

      $scope.getTemplate = function() {
        return 'MAIL_FOOTER';
      };
      $scope.add = function() {
        $modal.open({
          controller: 'mailFooterModalCtrl',
          templateUrl: 'ng_components/mailfooter/mailfooter_modal.tpl.html'
        });
      };
      $scope.delete = function(_mailFooter) {
        MailFooter.remove(_mailFooter).then(function() {
          $state.reinit();
        });
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          description: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
              $filter('orderBy')(mailFooters, params.orderBy()) :
              mailFooters;
          orderedData = params.filter ?
              $filter('filter')(orderedData, params.filter()) : orderedData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
