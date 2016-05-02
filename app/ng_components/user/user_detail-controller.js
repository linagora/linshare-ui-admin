'use strict';

angular.module('linshareAdminApp')
  .controller('UserDetailCtrl',
     ['$scope', '$modal', '$state',  '$log', 'User', 'selectOptions', 'currentUser', 'maxExpiryDate', 'restrictedGuestStatus', '$rootScope',
      function ($scope, $modal, $state, $log, User, selectOptions, currentUser, maxExpiryDate, restrictedGuestStatus, $rootScope) {
        $scope.userRoles = selectOptions.userRoles;
        $scope.userRolesSimple = ['SIMPLE', 'ADMIN'];
        $scope.user = currentUser;
        $scope.limit = maxExpiryDate;
        $scope.restrictedDisabled = restrictedGuestStatus;
        $scope.selectEnumLanguage = selectOptions.selectEnumLanguage;
        $scope.selectMailLanguage = selectOptions.selectMailLanguage;

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.opened = true;
        };
        $scope.removeContact = function(user, index) {
          user.restrictedContacts.splice(index, 1);
        };
        $scope.addContact = function(user, contact) {
          var exists = false;
          angular.forEach(user.restrictedContacts, function(elem) {
            if(elem.mail == contact.mail && elem.domain == contact.domain){
              exists = true;
              $log.info('The contact ' + contact.mail + ' has already been added to that guest\'s restricted contacts');
            }
          });
          if (!exists) {
            user.restrictedContacts.push(contact);
          }
        };
        $scope.userRepresentation = function (u) {
          return u.firstName.concat(" ", u.lastName, " ", u.mail, " ", u.domain);
        };
        $scope.searchGuestRestrictedContacts = function (pattern) {
          return User.autocomplete(pattern);
        };
        $scope.reset = function() {
          $state.reinit();
        };
        $scope.submit = function(user) {
          if (!$scope.user.restricted) {
            $scope.user.restrictedContacts = [];
          }
          User.update($scope.user);
        };
        $scope.isGuest = function() {
          return $scope.user.accountType == 'GUEST';
        };

        //To get the previous State to redirect to.
        if ($rootScope.routerState.current.name === 'user.detail') {
          $scope.goBackListBack = 'user.list';
        } else if ($rootScope.routerState.current.name === 'inconsistentuser.list.detail') {
          $scope.goBackListBack = 'inconsistentuser.list.all';
        } else {
          $scope.goBackListBack = 'inconsistentuser.search';
        }

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
              User.remove($scope.user).then(function() {
                $scope.$parent.dataUpTodate = false;
                $state.go($scope.goBackListBack);
              });
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        };

        $scope.changeDomain = function(selectedUsers) {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/user/user_changedomain_modal.tpl.html',
            controller: 'ChangeDomainModalCtrl',
            resolve: {
              allDomains: function(Domain) {
                return Domain.getAll();
              },
              selectedUsers: function() {
                return selectedUsers;
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              $scope.$parent.dataUpTodate = false;
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        }
      }
    ]
  );
