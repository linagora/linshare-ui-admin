'use strict';

angular.module('linshareAdminApp')
  .factory('GroupPattern', ['$q', '$log', 'Restangular', 'Notification',
    function ($q, $log, Restangular, Notification) {
      return {
        getAll: function () {
          $log.debug('GroupPattern:getAll');
          return Restangular.all('group_patterns').getList();
        },
        get: function (id) {
          $log.debug('GroupPattern:get');
          return Restangular.one('group_patterns', id).get();
        },
        add: function (groupPattern) {
          $log.debug('GroupPattern:add');
          return Restangular.all('group_patterns').post(groupPattern).then(function () {
            Notification.addSuccess('CREATE');
          });
        },
        update: function (groupPattern) {
          $log.debug('GroupPattern:update');
          return groupPattern.put().then(function () {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function (groupPattern) {
          $log.debug('GroupPattern:remove');
          return groupPattern.remove().then(function () {
            Notification.addSuccess('DELETE');
          });
        },
        getAllModels: function () {
          $log.debug('GroupPattern:getAllModels');
          return Restangular.all('group_patterns').all('models').getList();
        },
        copyFromModel: function (model) {
          var copy = Restangular.copy(model);
          copy.label = '';
          return copy;
        },
        getEmptyModel: function () {
          return { label: '' };
        }
      };
    }
  ]
  );
