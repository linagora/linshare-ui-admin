  'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentListCtrl',
    ['$scope', '$filter', '$modal', '$state', 'ngTableParams', 'mailContentRestService', 'mailContents', 'currentDomain',
    function($scope, $filter, $modal, $state, ngTableParams, mailContentRestService, mailContents, currentDomain) {

      $scope.domain = currentDomain;

      $scope.getTemplate = function () {
        return 'MAIL_CONTENT';
      };
      $scope.delete = function (_mailContent) {
        mailContentRestService.remove(_mailContent).then(function() {
          $state.reinit();
        });
      };
      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mailContentModalCtrl',
          templateUrl: 'ng_components/mailcontent/mailcontent_modal.tpl.html'
        });
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 100,      // count per page
        sorting: {
          mailContentType: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
              $filter('orderBy')(mailContents, params.orderBy()) :
              mailContents;
          orderedData = params.filter ?
              $filter('filter')(orderedData, params.filter()) : orderedData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

