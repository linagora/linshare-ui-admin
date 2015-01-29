'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentListCtrl',
            ['$scope', '$filter', '$log', '$modal', '$state', 'ngTableParams', 'mailContents', 'currentDomain', 'Languages',
    function($scope, $filter, $log, $modal, $state, ngTableParams, mailContents, currentDomain, Languages) {
      $scope.domain = currentDomain;

      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'mailContentModalCtrl',
          templateUrl: 'ng_components/mailcontent/mailcontent_modal.tpl.html'
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
          name: 'asc',
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
                    $filter('filter')(mailContents, params.filter()) :
                    mailContents;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

