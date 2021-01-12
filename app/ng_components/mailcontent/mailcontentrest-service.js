(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('mailContentRestService', mailContentRestService);

  mailContentRestService.$inject = ['$log', 'Notification', 'Restangular', 'customDeleteService'];

  function mailContentRestService($log, Notification, Restangular, customDeleteService) {
    //var self = this;
    var
      restUrl = 'mail_contents',
      restParam = {
        build: 'build',
        vars: 'vars'
      },
      service = {
        add: add,
        build: build,
        buildLive: buildLive,
        get: get,
        getAll: getAll,
        getContexts: getContexts,
        remove: remove,
        update: update
      };

    return service;

    ////////////

    //TODO [TOFILL]
    function add(mailContent) {
      $log.debug('mailContentRestService:add');
      return Restangular.all(restUrl).post(mailContent).then(function() {
        Notification.addSuccess('CREATE');
      });
    }

    /**
     * @name build
     * @desc Build a mail template registered in database
     * @param {string} mailContentId - Id of the mail template
     * @param {string} lang - Language to be used for render
     * @param {integer} context - Context to be used for render
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.mailUtilRestService
     */
    function build(mailContentId, mailConfigId, lang, context) {
      $log.debug('mailContentRestService:build');
      return Restangular.all(restUrl).one(mailContentId, restParam.build).get({
        language: lang,
        flavor: context,
        mailConfig: mailConfigId
      });
    }

    /**
     * @name buildLive
     * @desc Build a mail template from a content given
     * @param {Object} mailContenDto - The Template object
     * @param {string} lang - Language to be used for render
     * @param {integer} context - Context to be used for render
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.mailUtilRestService
     */
    function buildLive(mailContentDto, mailConfigId, lang, context) {
      $log.debug('mailContentRestService:buildLive');
      return Restangular.all(restUrl + '/' + restParam.build).post(mailContentDto, {
        language: lang,
        flavor: context,
        mailConfig: mailConfigId
      });
    }

    //TODO [TOFILL]
    function get(domainId, mailContentId) {
      $log.debug('mailContentRestService:get');
      return Restangular.one(restUrl, mailContentId).get({
        domainId: domainId
      });
    }

    //TODO [TOFILL]
    function getAll(domainId, onlyCurrentDomain) {
      $log.debug('mailContentRestService:getAll');
      return Restangular.all(restUrl).getList({
        domainId: domainId,
        onlyCurrentDomain: onlyCurrentDomain
      });
    }

    /**
     * @name getContexts
     * @desc Get context variable for a mailContent
     * @param {string} mailContentId - Id of the mail template
     * @returns {Promise} server response
     * @memberOf linshareAdminApp.mailUtilRestService
     */
    function getContexts(mailContentId) {
      $log.debug('mailContentRestService:getContexts');
      return Restangular.all(restUrl).one(mailContentId, restParam.vars).get();
    }

    //TODO [TOFILL]
    function remove(mailContent) {
      $log.debug('mailContentRestService:remove');
      return customDeleteService.remove('mail_contents', mailContent).then(function() {
        Notification.addSuccess('DELETE');
      });
    }

    //TODO [TOFILL]
    function update(mailContent) {
      $log.debug('mailContentRestService:update');
      return mailContent.put().then(function() {
        Notification.addSuccess('UPDATE');
      });
    }
  }
})();
