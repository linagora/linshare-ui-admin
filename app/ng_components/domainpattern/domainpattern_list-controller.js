'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPatternListCtrl',
    ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'domainPatterns',
    function($scope, $filter, $log, $translate, ngTableParams, domainPatterns) {
      $scope.getTemplate = function() {
        return 'DOMAIN_PATTERN';
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          label: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')(domainPatterns, params.orderBy()) :
                              domainPatterns;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );
