'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterListCtrl',
    ['$scope', '$filter', '$log', '$modal', '$state', '$translate', 'ngTableParams', 'MailFooter', 'mailFooters', 'currentDomain', 'Languages',
    function($scope, $filter, $log, $modal, $state, $translate, ngTableParams, MailFooter, mailFooters, currentDomain, Languages) {
      $scope.domain = currentDomain;
      $scope.getTemplate = function () {
        return 'MAIL_FOOTER';
      };
      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mailFooterModalCtrl',
          templateUrl: 'ng_components/mailfooter/mailfooter_modal.tpl.html'
        });
      };
      $scope.delete = function (_mailFooter) {
        MailFooter.remove(_mailFooter).then(function() {
          $state.reinit();
        });
      };
      $scope.filters = {
        language: Languages.langCmp($state.params.language).filter
      };
      $scope.$watch('filters.language',
        function(newValue) {
          $state.go('.', {domainId: $state.params.domainId, language: newValue});
        }
      );
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        filter: $scope.filters,
        sorting: {
          name: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
                    $filter('filter')(mailFooters, params.filter()) :
                    mailFooters;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
