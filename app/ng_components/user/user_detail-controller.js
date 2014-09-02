'use strict';

angular.module('linshareAdminApp')
  .controller('UserDetailCtrl',
     ['$scope', '$modal', '$state',  '$log', 'User', 'selectOptions', 'currentUser', 'maxExpiryDate', 'restrictedGuestStatus',
      function ($scope, $modal, $state, $log, User, selectOptions, currentUser, maxExpiryDate, restrictedGuestStatus) {
        $scope.userRoles = selectOptions.userRoles;
        $scope.user = currentUser;
        $scope.limit = maxExpiryDate;
        $scope.restrictedDisabled = restrictedGuestStatus;

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.opened = true;
        };
        $scope.removeContact = function(user, index) {
          user.restrictedContacts.splice(index, 1);
        };
        $scope.addContact = function(user, contact) {
          if (!_.contains(user.restrictedContacts, contact.mail)) {
            user.restrictedContacts.push(contact.mail);
          }
        };
        $scope.cancel = function() {
          $state.go('user.list');
        };
        $scope.reset = function() {
          $state.reinit();
        };
        $scope.submit = function(user) {
          User.update($scope.user, function successCallback(user) {
            $scope.cancel();
          });
        };
        $scope.delete = function(user) {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/common/confirm_modal.tpl.html',
            controller: 'ConfirmDialogCtrl',
            resolve: {
              content: function() {
                return 'MANAGE_USERS.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              User.remove($scope.user,
                function successCallback(user) {
                  $scope.cancel();
                }
              );
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        };
      }
    ]
  );
