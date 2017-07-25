/**
 * quotaRestService Factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('quotaRestService', quotaRestService);

  quotaRestService.$inject = ['$log', 'Restangular', 'Notification'];

  /**
   * @namespace quotaRestService
   * @desc Service to interract with Quota Object by REST
   * @memberOf linshareAdminApp
   */
  function quotaRestService($log, Restangular, Notification) {

    var
      restParam = {
        accounts: 'accounts',
        containers: 'containers',
        domains: 'domains',
      },
      restUrl = 'quotas',
      service = {
        getAccount: getAccount,
        getContainer: getContainer,
        getDomain: getDomain,
        getListAccount: getListAccount,
        getListContainer: getListContainer,
        getListDomain: getListDomain,
        updateAccount: updateAccount,
        updateContainer: updateContainer,
        updateDomain: updateDomain,
      };

    return service;

    ////////////

    /**
     * @name getAccount
     * @desc Get Quota object of a account
     * @param {string} uuid - Uuid of the account quota
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getAccount(uuid) {
      $log.debug('quotaRestService : getAccount', uuid);
      return Restangular.all(restUrl).one(restParam.accounts, uuid).get();
    }

    /**
     * @name getContainer
     * @desc Get Quota object of a container
     * @param {string} uuid - Uuid of the container quota
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getContainer(uuid) {
      $log.debug('quotaRestService : getContainer', uuid);
      return Restangular.all(restUrl).one(restParam.containers, uuid).get();
    }

    /**
     * @name getDomain
     * @desc Get Quota object of a domain
     * @param {string} uuid - Uuid of the domain quota
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getDomain(uuid) {
      $log.debug('quotaRestService : getDomain', uuid);
      return Restangular.all(restUrl).one(restParam.domains, uuid).get();
    }

    /**
     * @name getListAccount
     * @desc Get list of Quota object of all account
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getListAccount() {
      $log.debug('quotaRestService : getListAccount');
      return Restangular.one(restUrl, restParam.accounts).getList();
    }

    /**
     * @name getListContainer
     * @desc Get list of Quota object of all container
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getListContainer() {
      $log.debug('quotaRestService : getListContainer');
      return Restangular.one(restUrl, restParam.containers).getList();
    }

    /**
     * @name getListDomain
     * @desc Get list of Quota object of all domain
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function getListDomain() {
      $log.debug('quotaRestService : getListDomain');
      return Restangular.one(restUrl, restParam.domains).getList();
    }

    /**
     * @name updateAccount
     * @desc Update Quota object of a account
     * @param {Object} accountQuotaDto - Account Quota object
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function updateAccount(accountQuotaDto) {
      $log.debug('quotaRestService : updateAccount', accountQuotaDto);
      return Restangular.all(restUrl).one(restParam.accounts, accountQuotaDto.uuid).customPUT(accountQuotaDto)
        .then(function(data) {
          Notification.addSuccess('UPDATE');
          return data;
        });
    }

    /**
     * @name updateContainer
     * @desc Update Quota object of a container
     * @param {Object} containerQuotaDto - Container Quota object
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function updateContainer(containerQuotaDto) {
      $log.debug('quotaRestService : updateContainer', containerQuotaDto);
      return Restangular.all(restUrl).one(restParam.containers, containerQuotaDto.uuid)
        .customPUT(containerQuotaDto)
        .then(function(data) {
          Notification.addSuccess('UPDATE');
          return data;
        });
    }

    /**
     * @name updateDomain
     * @desc Update Quota object of a domain
     * @param {Object} domainQuotaDto - Domain Quota object
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.quotaRestService
     */
    function updateDomain(domainQuotaDto) {
      $log.debug('quotaRestService : updateDomain', domainQuotaDto);
      return Restangular.all(restUrl).one(restParam.domains, domainQuotaDto.uuid).customPUT(domainQuotaDto)
        .then(function(data) {
          Notification.addSuccess('UPDATE');
          return data;
        });
    }
  }
})();
