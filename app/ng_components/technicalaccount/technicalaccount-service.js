'use strict';

angular.module('linshareAdminApp')
  .factory('TechnicalAccount', ['$log', 'Notification', 'Restangular',
    function($log, Notification, Restangular) {
      //var self = this;

      // Public API here
      return {
        getAll: function() {
          $log.debug('TechnicalAccount:getAll');
          return Restangular.all('technical_accounts').getList();
        },
        get: function(id) {
          $log.debug('TechnicalAccount:get');
          return Restangular.one('technical_accounts', id).get();
        },
        getHeaders: function() {
          $log.debug('AuthenticationRestService : logout');
          var rest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
          });

          return rest.all('authentication').one('authorized').options().then(function(response) {
            return response.headers();
          });
        },
        add: function(account) {
          $log.debug('TechnicalAccount:add');
          return Restangular.all('technical_accounts').post(account).then(function() {
            Notification.addSuccess('CREATE');
          });
        },
        update: function(account) {
          $log.debug('TechnicalAccount:update');
          return account.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        changePassword: function(accountId, password) {
          $log.debug('TechnicalAccount:changePassword');
          return Restangular.all('technical_accounts').all(accountId).all('change_password').post(password)
            .then(function() {
              Notification.addSuccess('UPDATE');
            });
        },
        remove: function(account) {
          $log.debug('TechnicalAccount:remove');
          return account.remove().then(function() {
            Notification.addSuccess('DELETE');
          });
        }
      };
    }
  ]
);
