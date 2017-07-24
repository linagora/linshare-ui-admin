/**
 * auditRestService factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('auditRestService', auditRestService);

  auditRestService.$inject = ['$log', 'Restangular'];

  /**
   * @namespace auditRestService
   * @desc Service to interact with Audit object by REST
   * @memberOf linshareAdminApp
   */
  function auditRestService($log, Restangular) {
    var
      restUrl = 'audit',
      service = {
        getList: getList
      };

    return service;

    ////////////

    /**
     * @name getList
     * @desc Get list of the audit object
     * @param {Object} [params] - Parameters added to do a search by date
     * @property {Date} params.beginDate - Begin date of audit to find
     * @property {Date} params.endDate - End date of audit to find
     * @returns {promise} server response
     * @memberOf linshareAdminApp.auditRestService
     */
    function getList(params) {
      $log.debug('auditRestService : getList');
      return Restangular.all(restUrl).getList(params);
    }
  }
})();
