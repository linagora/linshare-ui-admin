/**
 * upgradeTasksRestService Factory
 * @namespace lijnshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('upgradeTasksRestService', upgradeTasksRestService);

  upgradeTasksRestService.$inject = ['$log', 'Restangular'];

  function upgradeTasksRestService($log, Restangular) {
    var restParam = {
        asyncTasks: 'async_tasks',
        console: 'console'
      },
      restUrl = 'upgrade_tasks',
      service = {
        execute: execute,
        get: get,
        getList: getList,
        getTask: getTask,
        getTaskConsole: getTaskConsole,
        getTasksList: getTasksList
      };

    return service;

    ////////////

    /**
     * @name execute
     * @desc Execute the upgrade task based on the identifier given
     * @param {string} identifier - Identifier of the upgrade task
     * @param {boolean} force - Determine is execution should be forced
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function execute(identifier, force) {
      $log.debug('upgradeTasksRestService : execute', identifier, force);
      return Restangular.one(restUrl, identifier).customPUT({}, null, {force: force});
    }

    /**
     * @name get
     * @desc Get the upgrade task based on the identifier given
     * @param {string} identifier - Identifier of the upgrade task
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function get(identifier) {
      $log.debug('upgradeTasksRestService : get', identifier);
      return Restangular.one(restUrl, identifier).get();
    }

    /**
     * @name getList
     * @desc Get the upgrade tasks
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function getList() {
      $log.debug('upgradeTasksRestService : getList');
      return Restangular.all(restUrl).getList();
    }

    /**
     * @name getTask
     * @desc Get the async task of an upgrade task based on the uuid given
     * @param {string} upgradeTaskId - Identifier of the upgrade task
     * @param {string} asyncTaskuuid - Uuid of the async task
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function getTask(upgradeTaskId, asyncTaskUuid) {
      $log.debug('upgradeTasksRestService : getTask', upgradeTaskId, asyncTaskUuid);
      return Restangular.one(restUrl, upgradeTaskId).one(restParam.asyncTasks, asyncTaskUuid).get();
    }

    /**
     * @name getTaskConsole
     * @desc Get the async task console based on the uuid given
     * @param {string} upgradeTaskId - Identifier of the upgrade task
     * @param {string} asyncTaskuuid - Uuid of the async task
     * @param {string} fromDate - Log start date
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function getTaskConsole(upgradeTaskId, asyncTaskUuid, fromDate) {
      $log.debug('upgradeTasksRestService : getTaskConsole', upgradeTaskId, asyncTaskUuid);
      return Restangular.one(restUrl, upgradeTaskId).one(restParam.asyncTasks, asyncTaskUuid).one(restParam.console)
        .get({'fromDate': fromDate});
    }

    /**
     * @name getTasksList
     * @desc Get the async tasks list of an upgrade task
     * @param {string} upgradeTaskId - Identifier of the upgrade task
     * @returns {Promise} Server response
     * @memberOf linshareAdminApp.upgradeTasksRestService
     */
    function getTasksList(upgradeTaskId) {
      $log.debug('upgradeTasksRestService : getTasksList', upgradeTaskId);
      return Restangular.one(restUrl, upgradeTaskId).one(restParam.asyncTasks).get();
    }
  }
})();
