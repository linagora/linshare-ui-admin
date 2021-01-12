'use strict';

angular.module('linshareAdminApp')
  .factory('User', ['$q', '$log', 'Restangular', 'Notification', '$http', 'customDeleteService',
    function($q, $log, Restangular, Notification, $http, customDeleteService) {
      // var self = this;

      // Public API here
      return {
        autocomplete: function(pattern) {
          $log.debug('User:autocomplete');
          return Restangular.all('users').one('autocomplete', pattern).get();
        },
        createUser: function(userDto) {
          $log.debug('User:createUser');

          return Restangular.all('users').post(userDto);
        },
        search: function(userSearchDto) {
          $log.debug('User:search');
          return Restangular.all('users').customPOST(userSearchDto, 'search').then(function(users) {
            angular.forEach(users, function(user) {
              user = Restangular.restangularizeElement(null, user, 'users');
            });
            var dfd = $q.defer();
            dfd.resolve(users);
            return dfd.promise;
          });
        },
        get: function(uuid) {
          $log.debug('User:get');
          return Restangular.one('users', uuid).get();
        },
        exist: function(uuid) {
          $log.debug('User:exist');
          return Restangular.one('users', uuid).head();
        },
        getAllInconsistent: function() {
          $log.debug('User:getAllInconsistent');
          return Restangular.all('users').all('inconsistent').getList();
        },
        getInconsistencyStatus: function(mail) {
          $log.debug('User:getInconsistencyStatus');
          return Restangular.all('users').all('inconsistent/check').customPOST(mail);
        },
        autocompleteInconsistent: function(pattern) {
          $log.debug('User:autocompleteInconsistent');
          var userSearchDto = {mail: pattern};
          return Restangular.all('users').all('inconsistent/autocomplete').customPOST(userSearchDto);
        },
        update: function(user) {
          $log.debug('User:update');
          return user.put().then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        updateInconsistent: function(user) {
          $log.debug('User:update User with Inconsistent EndPoint');
          return Restangular.all('users').all('inconsistent').customPUT(user).then(function() {
            Notification.addSuccess('UPDATE');
          });
        },
        remove: function(user) {
          $log.debug('User:remove');
          return customDeleteService.remove('users', user).then(function() {
            Notification.addSuccess('DELETE');
          });
        },
        changeInternalUsersEmail: function(csvFormData) {
          return $http.post('/linshare/users/mail_migration', csvFormData, {
            transformRequest : angular.identity,
            headers: {'Content-Type': undefined }
          }).then(function(state) {
            Notification.addSuccess('MIGRATION_SUCCEED');
            $log.debug('Success of the emails migration', state);
            var dfd = $q.defer();
            dfd.resolve(state);
            return dfd.promise;
          }, function(error) {
            Notification.addError(error);
            $log.debug('Error of the emails migration', error);
            var dfd = $q.defer();
            dfd.resolve(error);
            return dfd.promise;
          });
        },
        get2FAStatus: function(userUuid) {
          $log.debug('User:get2FAStatus', userUuid);

          return Restangular.one('users', userUuid).one('2fa', userUuid).get().then(function(res) {
            return res.enabled;
          });
        },
        delete2FAKey: function(userUuid) {
          $log.debug('User:delete2FAKey', userUuid);

          return Restangular.one('users', userUuid).one('2fa', userUuid).remove().then(function() {
            Notification.addSuccess('UPDATE');
          });
        }
      };
    }
  ]
);
