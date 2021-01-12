/**
* groupPatternService factory
* @namespace linshareAdminApp
*/
(function () {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('groupPatternService', groupPatternService);

  groupPatternService.$inject = [
    '$log',
    'Notification',
    'Restangular',
    'customDeleteService'
  ];

  /**
   * @namespace groupPatternService
   * @desc Service to interact with Group pattern object by REST
   * @memberOf linshareAdminApp
   */
  function groupPatternService(
    $log,
    Notification,
    Restangular,
    customDeleteService
  ) {
    var
      restUrl = 'group_patterns',
      service = {
        getAll: getAll,
        get: get,
        add: add,
        update: update,
        remove: remove,
        getAllModels: getAllModels,
        copyFromModel: copyFromModel,
        getEmptyModel: getEmptyModel
      };

    return service;

    ////////////

    function getAll() {
      $log.debug('groupPatternService:getAll');
      return Restangular.all(restUrl).getList();
    }

    function get(id) {
      $log.debug('groupPatternService:get');
      return Restangular.one(restUrl, id).get();
    }

    function add(groupPattern) {
      $log.debug('groupPatternService:add');
      return Restangular.all(restUrl).post(groupPattern).then(function () {
        Notification.addSuccess('CREATE');
      });
    }

    function update(groupPattern) {
      $log.debug('groupPatternService:update');
      return groupPattern.put().then(function () {
        Notification.addSuccess('UPDATE');
      });
    }

    function remove(groupPattern) {
      $log.debug('groupPatternService:remove');
      return customDeleteService.remove('group_patterns', groupPattern).then(function() {
        Notification.addSuccess('DELETE');
      });
    }

    function getAllModels() {
      $log.debug('groupPatternService:getAllModels');
      return Restangular.all(restUrl).all('models').getList();
    }

    function copyFromModel(model) {
      var copy = Restangular.copy(model);
      copy.label = '';
      return copy;
    }

    function getEmptyModel() {
      return { label: '' };
    }
  }
})();
