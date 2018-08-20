/**
* GroupPatternListController Controller
* @namespace GroupPatternListController
* @memberOf linshareAdminApp
*/
(function () {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('GroupPatternListController', GroupPatternListController);

  GroupPatternListController.$inject = [
    '$filter',
    'groupPatterns',
    'ngTableParams'
  ];

  /**
   * @namespace GroupPatternListController
   * @desc Application group pattern list controller
   * @memberOf linshareAdminApp
   */
  function GroupPatternListController(
    $filter,
    groupPatterns,
    ngTableParams
  ) {
    /* jshint validthis: true */
    var groupPatternListVm = this;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.GroupPatternDetailController
     */
    function activate() {
      launchTableParamsInitiation();
    }

    groupPatternListVm.getTemplate = function () {
      return 'GROUP_PATTERN';
    };

    /**
   * @name launchTableParamsInitiation
   * @desc Initialize tableParams and related functions
   * @memberOf linshareAdminApp.GroupPatternDetailController
   */
    function launchTableParamsInitiation() {
      groupPatternListVm.tableParams = new ngTableParams(
        {
          page: 1,
          count: 10,
          sorting: {
            label: 'asc'
          }
        },
        {
          debugMode: false,
          total: 0, // length of data
          getData: function ($defer, params) {
            var orderedData = params.sorting() ?
              $filter('orderBy')(groupPatterns, params.orderBy()) :
              groupPatterns;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        }
      );
    }
  }
})();
