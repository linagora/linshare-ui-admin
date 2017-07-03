'use strict';

angular.module('linshareAdminApp')
  .factory('WelcomeMessage',
    ['$q', '$log', 'Notification', 'Restangular',
    function($q, $log, Notification, Restangular) {
      // var self = this;
      // Public API here
      return {
        getAll: function(_domainId, parent) {
          $log.debug('WelcomeMessages:getAll');
          parent = parent || false;
          return Restangular.all('welcome_messages').getList({domainId: _domainId, parent: parent});
        },
        get: function(id) {
          $log.debug('WelcomeMessages:get');
          return Restangular.one('welcome_messages', id).get({tree: true});
        },
        add: function(welcomeMessage) {
          $log.debug('WelcomeMessages:add');
          return Restangular.all('welcome_messages').post(welcomeMessage).then(function(welcomeMessage) {
            Notification.addSuccess('CREATE');
            return welcomeMessage;
          });
        },
        update: function(welcomeMessage) {
          $log.debug('WelcomeMessages:update');
          return welcomeMessage.put().then(function(welcomeMessage) {
            Notification.addSuccess('UPDATE');
            return welcomeMessage;
          });
        },
        remove: function(welcomeMessage) {
          $log.debug('WelcomeMessages:remove');
          return welcomeMessage.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
