/**
 * UpgradeTasksController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('UpgradeTasksController', UpgradeTasksController);

  UpgradeTasksController.$inject = ['$filter', '$modal', '$q', '$scope', '$state', '$timeout', 'moment', 'ngTableParams',
    'upgradeTasksConstants', 'upgradeTasksRestService'
  ];

  function UpgradeTasksController($filter, $modal, $q, $scope, $state, $timeout, moment, ngTableParams, upgradeTasksConstants,
    upgradeTasksRestService) {
    var upgradeTasksVm = this;

    upgradeTasksVm.getHelp = getHelp;
    upgradeTasksVm.status = upgradeTasksConstants.status;
    upgradeTasksVm.upgradeTasksRestService = upgradeTasksRestService;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.UpgradeTasksController
     */
    function activate() {
      loadTable().then(function(tableData) {
        upgradeTasksVm.tableParams = tableData;
      });
    }

    /**
     * @name getHelp
     * @desc Retrieve template name for user information
     * @returns {string} template name
     * @memberOf linshareAdminApp.UpgradeTasksController
     */
    function getHelp() {
      return 'UPGRADE_TASKS';
    }

    /**
     * @name loadTable
     * @desc Load the table
     * @memberOf linshareAdminApp.UpgradeTasksController
     */
    function loadTable() {
      var deferred = $q.defer();
      deferred.resolve(
        new ngTableParams({
          page: 1,
          count: 25,
          sorting: {
            taskOrder: 'asc'
          }
        }, {
          debugMode: false,
          getData: function($defer, params) {
            return upgradeTasksRestService.getList().then(function(upgradeTasksData) {
              _.forEach(upgradeTasksData, function(upgradeTask) {
                setUpgradeTaskActions(upgradeTask);
              });
              var list = params.sorting() ? $filter('orderBy')(upgradeTasksData, params.orderBy()) : upgradeTasksData;
              params.total(list.length);
              $defer.resolve(list.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          }
        })
      );
      return deferred.promise;
    }

    /**
     * @name setUpgradeTaskActions
     * @desc Set action function to a given upgrade task object
     * @param {Object} upgradeTask - An upgrade task object
     * @memberOf linshareAdminApp.UpgradeTasksController
     */
    function setUpgradeTaskActions(upgradeTask) {
      /**
       * @name canExecute
       * @desc Determine if the upgrade task can be executed
       * @returns {boolean} true if the upgrade task can be executed
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.canExecute = function canExecute() {
        return (this.isParentDone() && this.status === upgradeTasksVm.status.NEW);
      };

      /**
       * @name canRetry
       * @desc Determine if the upgrade task can be retried
       * @returns {boolean} true if the upgrade task can be retried
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.canRetry = function canRetry() {
        return (this.isParentDone() && this.status !== upgradeTasksVm.status.NEW);
      };

      /**
       * @name canShowConsole
       * @desc Determine if the upgrade task can show is console
       * @returns {boolean} true if the upgrade task can show is console
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.canShowConsole = function canShowConsole() {
        return (!_.isUndefined(this.asyncTaskUuid) && this.asyncTaskUuid !== null);
      };

      /**
       * @name execute
       * @desc Execute the upgrade task
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.execute = function execute() {
        var self = this;
        if (self.canExecute()) {
          doExecute(self);
        } else if (self.canRetry()) {
          var modalScope = $scope.$new();
          modalScope.status = self.status;
          $modal.open({
            templateUrl: 'ng_components/upgradetasks/views/upgradetasks.modal.html',
            scope: modalScope
          }).result.then(function(validate) {
            if (validate) {
              doExecute(self);
            }
          });
        }

        /**
         * @name doExecute
         * @desc Trigger upgrade task execution with table reload
         * @param {Object} upgradeTask - An upgrade task object
         * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions.execute
         */
        function doExecute(upgradeTask) {
          upgradeTasksVm.upgradeTasksRestService.execute(upgradeTask.identifier, true).then(function(upgradeTaskData) {
            $timeout(function() {
              _.assign(upgradeTask, upgradeTaskData);
              upgradeTask.showConsole();
            }, 1000);
          });
        }
      };

      /**
       * @name isParentDone
       * @desc Determine if the parent upgrade task has been successfully executed
       * @returns {boolean} true if the parent upgrade task is successfull
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.isParentDone = function isParentDone() {
        if (_.isUndefined(this.parentIdentifier) || this.parentIdentifier === null) {
          return true;
        }
        return !_.isUndefined(_.find(upgradeTasksVm.tableParams.data, {
          identifier: this.parentIdentifier,
          status: upgradeTasksVm.status.SUCCESS
        }));
      };

      /**
       * @name showConsole
       * @desc show the console of the last async task executed of the upgrade task
       * @memberOf linshareAdminApp.UpgradeTasksController.setUpgradeTaskActions
       */
      upgradeTask.showConsole = function showConsole() {
        if (this.canShowConsole()) {
          $state.go('upgradetasks.asynctasks.details', {
            upgradeTasksId: this.identifier,
            asyncTasksUuid: this.asyncTaskUuid
          });
        }
      };
    }
  }
})();
