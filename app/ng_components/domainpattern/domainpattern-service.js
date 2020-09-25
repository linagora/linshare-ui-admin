'use strict';

angular.module('linshareAdminApp')
  .factory('DomainPattern', ['$q', '$log', '$http', 'lsAppConfig', 'Restangular', 'Notification',
    function($q, $log, $http, lsAppConfig, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('DomainPattern:getAll');
          return Restangular.all('domain_patterns').getList();
        },
        get: function(id) {
          $log.debug('DomainPattern:get');
          return Restangular.one('domain_patterns', id).get();
        },
        add: function(domainPattern) {
          $log.debug('DomainPattern:add');
          return Restangular.all('domain_patterns').post(domainPattern).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(domainPattern) {
          $log.debug('DomainPattern:update');
          return domainPattern.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(domainPattern) {
          $log.debug('DomainPattern:remove');

          return $http({
            method: 'DELETE',
            url: `${lsAppConfig.backendURL}/domain_patterns`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: Restangular.stripRestangular(domainPattern).originalElement
          }).then(function() {
            Notification.addSuccess('DELETE');
          });
        },
        getAllModels: function() {
          $log.debug('DomainPattern:getAllModels');
          return Restangular.all('domain_patterns').all('models').getList();
        },
        copyFromModel: function(model) {
          var copy = Restangular.copy(model);
          copy.label = '';
          return copy;
        },
        getEmptyModel: function() {
          return {label: ''};
        }
      };
    }
  ]
);
