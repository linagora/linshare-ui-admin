'use strict';

angular.module('linshareAdminApp')
  .factory('MailActivation',
    ['$log', 'Restangular',
    function ($log, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function(domainId, identifier) {
          $log.debug('MailActivation:getAll');
          return Restangular.all('mail_activations').getList({domainId: domainId, parentId: identifier});
        },
        get: function(domainId, funcId) {
          $log.debug('MailActivation:get');
          return Restangular.one('mail_activations', funcId).get({domainId: domainId});
        },
        update: function(mailActivation) {
          $log.debug('MailActivation:update');
          return mailActivation.put();
        },
        remove: function(mailActivation) {
          $log.debug('MailActivation:remove');
          return mailActivation.remove();
        }
      };
    }
  ]
);
