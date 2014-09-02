'use strict';

angular.module('linshareAdminApp')
  .factory('DomainPattern', ['$log', 'Restangular', 'Notification',
    function ($log, Restangular, Notification) {
      //var self = this;

      // Public API here
      return {
        getAll: function(successCallback) {
          $log.debug('DomainPattern:getAll');
          return Restangular.all('domain_patterns').getList().then(
            function success(domainPatterns) {
              if (successCallback) {
                return successCallback(domainPatterns);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:getAll',
                 'Unable to get all domain patterns',
                ].join('\n')
              );
            }
          );
        },
        get: function(id, successCallback) {
          $log.debug('DomainPattern:get');
          return Restangular.one('domain_patterns', id).get().then(
            function success(domainPattern) {
              if (successCallback) {
                return successCallback(domainPattern);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:get',
                 'Unable to get a domain pattern',
                ].join('\n')
              );
            }
          );
        },
        add: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:add');
          return Restangular.all('domain_patterns').post(domainPattern).then(
            function success(domainPattern) {
              Notification.addSuccess('CREATE');
              if (successCallback) {
                return successCallback(domainPattern);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:add',
                 'Unable to create a domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        update: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:update');
          return domainPattern.put().then(
            function success(domainPattern) {
              Notification.addSuccess('UPDATE');
              if (successCallback) {
                return successCallback(domainPattern);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:update',
                 'Unable to update domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        remove: function(domainPattern, successCallback) {
          $log.debug('DomainPattern:remove');
          return domainPattern.remove().then(
            function success(domainPattern) {
              Notification.addSuccess('DELETE');
              if (successCallback) {
                return successCallback(domainPattern);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:remove',
                 'Unable to remove domain pattern',
                ].join('\n')
              );
              $log.error(domainPattern);
            }
          );
        },
        getAllModels: function(successCallback) {
          $log.debug('DomainPattern:getAllModels');
          return Restangular.all('domain_patterns').all('models').getList().then(
            function success(models) {
              if (successCallback) {
                return successCallback(models);
              }
            },
            function error() {
              $log.error(
                [
                 'DomainPattern:remove',
                 'Unable to get all domain pattern model',
                ].join('\n')
              );
            });
        },
        copyFromModel: function(model) {
          var copy = Restangular.copy(model);
          copy.identifier = '';
          return copy;
        },
        getEmptyModel: function() {
          return {identifier: ''};
        },
      };
    }
  ]
);
