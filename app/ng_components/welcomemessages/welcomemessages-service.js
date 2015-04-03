'use strict';

angular.module('linshareAdminApp')
  .factory('WelcomeMessages',
    ['$q', '$log', 'Notification', 'Restangular',
    function ($q, $log, Notification, Restangular) {
      // var self = this;
      // Public API here
      return {
        getAll: function() {
          $log.debug('WelcomeMessages:getAll');
          return Restangular.all('welcome_messages').getList();
        },
        get: function(id) {
          $log.debug('WelcomeMessages:get');
          return Restangular.one('welcome_messages', id).get({tree: true});
        },
        add: function(domain) {
          $log.debug('WelcomeMessages:add');
          return Restangular.all('welcome_messages').post(domain).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(domain, notify) {
          $log.debug('WelcomeMessages:update');
          notify = typeof notify !== 'undefined' ? notify : true;
          delete domain.children;
          return domain.put().then(function() {
            if (notify) {
              Notification.addSuccess('UPDATE');
            }
          });
        },
        remove: function(domain) {
          $log.debug('WelcomeMessages:remove');
          return domain.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
