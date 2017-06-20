/**
 * AsyncTasksController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('AsyncTasksController', AsyncTasksController);

  AsyncTasksController.$inject = ['$filter', '$q', '$state', '$window', 'moment', 'ngTableParams',
    'upgradeTask', 'upgradeTasksRestService'
  ];

  function AsyncTasksController($filter, $q, $state, $window, moment, ngTableParams, upgradeTask,
    upgradeTasksRestService) {
    var asyncTasksVm = this;

    asyncTasksVm.$window = $window;
    asyncTasksVm.getHelp = getHelp;
    asyncTasksVm.upgradeTask = upgradeTask;
    asyncTasksVm.upgradeTasksRestService = upgradeTasksRestService;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.AsyncTasksController
     */
    function activate() {
      loadTable().then(function(tableData) {
        asyncTasksVm.tableParams = tableData;
      });
    }

    /**
     * @name getHelp
     * @desc Retrieve template name for user information
     * @returns {string} template name
     * @memberOf linshareAdminApp.AsyncTasksController
     */
    function getHelp() {
      return 'ASYNC_TASKS';
    }

    /**
     * @name loadTable
     * @desc Load the table
     * @memberOf linshareAdminApp.AsyncTasksController
     */
    function loadTable() {
      var deferred = $q.defer();
      deferred.resolve(
        new ngTableParams({
          page: 1,
          count: 10,
          sorting: {
            modificationDate: 'desc'
          }
        }, {
          debugMode: false,
          getData: function($defer, params) {
            return upgradeTasksRestService.getTasksList(upgradeTask.identifier).then(function(asyncTasksData) {
              _.forEach(asyncTasksData, function(asyncTask) {
                setAsyncTaskActions(asyncTask);
                asyncTask.modificationDate = asyncTask.modificationDate;
                asyncTask.creationDate = moment(asyncTask.creationDate).format('ll') + ' ' +
                  moment(asyncTask.creationDate).format('LTS');
              });
              var list = params.sorting() ? $filter('orderBy')(asyncTasksData, params.orderBy()) : asyncTasksData;
              params.total(list.length);
              $defer.resolve(list.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        })
      );
      return deferred.promise;
    }

    /**
     * @name setAsyncTaskActions
     * @desc Set action function to a given async task object
     * @param {Object} asyncTask - An async task object
     * @memberOf linshareAdminApp.AsyncTasksController
     */
    function setAsyncTaskActions(asyncTask) {
      asyncTask.showConsole = showConsole;
      asyncTask.getDuration = getDuration;

      /**
       * @name getDuration
       * @desc Retrieve the task duration humanized or formatted as 'HH:mm:ss.SSS'
       * @param {boolean} humanize - Determine if humanized format should be used
       * @returns {string} Duration humanized or formatted as 'HH:mm:ss.SSS'
       * @memberOf linshareAdminApp.AsyncTasksController.setAsyncTaskActions
       */
      function getDuration(humanize) {
        return humanize ? moment.duration(asyncTask.processingDuration).humanize() :
          moment.utc(moment.duration(asyncTask.processingDuration).asMilliseconds()).format('HH:mm:ss.SSS');
      }

      /**
       * @name showConsole
       * @desc show the console of the last async task executed of the async task
       * @memberOf linshareAdminApp.AsyncTasksController.setAsyncTaskActions
       */
      function showConsole() {
        $state.go('upgradetasks.asynctasks.details', {
          upgradeTasksId: asyncTasksVm.upgradeTask.identifier,
          asyncTasksUuid: this.uuid /* jshint ignore:line */
        });
      }
    }
  }
})();
