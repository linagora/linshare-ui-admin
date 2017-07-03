/**
 * AsyncTasksDetailsController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('AsyncTasksDetailsController', AsyncTasksDetailsController);

  AsyncTasksDetailsController.$inject = ['_', '$scope', '$window', 'asyncTask', 'moment', 'upgradeTask',
    'upgradeTasksConstants', 'upgradeTasksRestService'
  ];

  function AsyncTasksDetailsController(_, $scope, $window, asyncTask, moment, upgradeTask, upgradeTasksConstants,
    upgradeTasksRestService) {
    var asyncTaskVm = this;

    asyncTaskVm.$window = $window;
    asyncTaskVm.asyncTask = asyncTask;
    asyncTaskVm.createRefresher = createRefresher;
    asyncTaskVm.filterLog = filterLog;
    asyncTaskVm.getHelp = getHelp;
    asyncTaskVm.upgradeTask = upgradeTask;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function activate() {
      asyncTaskVm.console = {
        data: {}
      };

      asyncTaskVm.log = {
        selected: {
          DEBUG: false,
          ERROR: true,
          INFO: true,
          WARNING: true
        },
        values: Object.values(upgradeTasksConstants.log)
      };

      asyncTaskVm.timer = 1000;
      createRefresher();

      $scope.$on('$destroy', function() {
        clearInterval(asyncTaskVm.refresher);
      });
    }

    /**
     * @name createRefresher
     * @desc Assign the timer created to asyncTaskVm.refresher
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function createRefresher() {
      asyncTaskVm.refresher = refresher();
    }

    /**
     * @name filterLog
     * @desc filter console log depending on log level checked & format properly log
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function filterLog() {
      asyncTaskVm.console.show = _.cloneDeep(_.filter(asyncTaskVm.console.data, function(line) {
        return asyncTaskVm.log.selected[line.criticity.replace(/\u00A0/g, '')];
      }));
    }

    /**
     * @name getConsole
     * @desc Retrieve log data to be shown in the console
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function getConsole() {
      upgradeTasksRestService.getTaskConsole(upgradeTask.identifier, asyncTask.uuid, asyncTaskVm.fromDate)
        .then(function(consoleData) {
          var values = consoleData.plain();
          _.forEach(values, function(line) {
            line.creationDate = moment(line.creationDate).format('L') + ' - ' +
              moment(line.creationDate).format('LTS');
            switch (line.criticity) {
              case upgradeTasksConstants.log.DEBUG:
              case upgradeTasksConstants.log.ERROR:
                line.criticity += '\u00A0\u00A0\u00A0';
                break;
              case upgradeTasksConstants.log.INFO:
                line.criticity += '\u00A0\u00A0\u00A0\u00A0';
                break;
            }
          });
          _.assign(asyncTaskVm.console.data, values);
          filterLog();
        });
      asyncTaskVm.fromDate = moment().subtract(1, 'seconds').toISOString();
    }

    /**
     * @name getHelp
     * @desc Retrieve template name for user information
     * @returns {string} template name
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function getHelp() {
      return 'ASYNC_TASK';
    }

    /**
     * @name refresher
     * @desc Create an interval to request log and show them in the console view
     * @return {integer} ID value of the timer set
     * @memberOf linshareAdminApp.AsyncTasksDetailsController
     */
    function refresher() {
      return setInterval(function() {
        getConsole();
        upgradeTasksRestService.get(upgradeTask.identifier).then(function(data) {
          if (data.status !== upgradeTasksConstants.status.PROCESSING &&
            data.status !== upgradeTasksConstants.status.PENDING) {
            clearInterval(asyncTaskVm.refresher);
          }
        }).catch(function() {
          clearInterval(asyncTaskVm.refresher);
        });
      }, asyncTaskVm.timer);
    }
  }
})();
