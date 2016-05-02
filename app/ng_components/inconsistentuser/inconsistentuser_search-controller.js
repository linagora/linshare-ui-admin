/**
 * Created by Alpha O. Sall on April 29th 2016.
 */

'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserSearchListCtrl', ['$scope', '$state', 'User', '$q', 'Restangular', '$modal', '$log',
    function($scope, $state, User, $q, Restangular, $modal, $log) {

      $scope.inconsistent = {};
      $scope.getStatus = function(user) {
        $state.go('inconsistentuser.search');
        $scope.searchValue = user.mail;
        User.getInconsistencyStatus(user).then(function(result) {
          $scope.accounts = result;
          $scope.dataUpTodate = true;
        });
      };
      $scope.searchUsersAccount = function(pattern) {
        var defered = $q.defer();
        $scope.searchValue = pattern;
        User.autocompleteInconsistent(pattern).then(function(listUsers) {
          defered.resolve(listUsers);
        });
        return defered.promise;
      };
      $scope.userRepresentation = function(u) {
        if (angular.isString(u)) {
          return u;
        }
        return u.firstName.concat(' ', u.lastName, ' ', u.mail, ' ', u.domain);
      };
      $scope.dataUpTodate = true;
      $scope.showUserDetail = function(user) {
        $scope.currentDetailState = user.uuid;
        if (user.database) {
          $state.go('inconsistentuser.search.detail', {uuid: user.uuid});
        } else {
          createUserProfile(user);
        }
      };

      var createUserProfile = function(user) {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'MANAGE_USERS.CONFIRM_CREATE_PROFILE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            var userDto = {uuid: user.uuid, mail: user.userMail, domain: user.identifier};
            Restangular.all('users').post(userDto).then(function(user) {
              $scope.dataUpTodate = false;
              $state.go('inconsistentuser.search.detail', {uuid: user.uuid});
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
    }]);
