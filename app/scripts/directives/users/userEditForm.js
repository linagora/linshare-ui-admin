'use strict';

app.directive('lsUserEditForm', ['$timeout', 
  function($timeout) {
    return {
      restrict: 'A',
      transclude: false,
      scope: { userToEdit: '=' },
      link: function(scope, element, attrs) {
        scope.userRepresentation = function(user) {
          if (!_.isUndefined(user)) {
            return user.firstName + ' ' + user.lastName + ' <' + user.mail + '>';
          }
        };
        scope.showUserEditForm = false;
        scope.today = new Date();
      },
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'localize', 'notificationService',
        function($scope, $rootScope, $log, Restangular, Localize, notificationService) {
          $scope.userRoles = Restangular.all('user_roles').getList();
          $scope.user = {};
          $scope.open = function() {
            $timeout(function() {
              $scope.opened = true;
            });
          };
          $scope.limit = new Date();
          $scope.restrictedDisabled = false;
          $scope.getStatus = function(user) {
            if (!_.isUndefined(user)) {
              if (user.guest === true) {
                return Localize.getLocalizedString('P_Users-Management_StatusGuest');
              } else if (user.role === 'ADMIN') {
                return Localize.getLocalizedString('P_Users-Management_StatusAdmin');
              } else if (user.role === 'SIMPLE') {
                return Localize.getLocalizedString('P_Users-Management_StatusSimple');
              }
            }
          };
          $scope.removeContact = function(user, index) {
            user.restrictedContacts.splice(index, 1);
          };
          $scope.addContact = function(user, contact) {
            if (!_.contains(user.restrictedContacts, contact.mail)) {
              user.restrictedContacts.push(contact.mail);
            }
          };
          $scope.$watch('userToEdit', function(newValue, oldValue) {
            if (!_.isEmpty(newValue)) {
              angular.copy(newValue, $scope.user);
              Restangular.all('domains').all(newValue.domain).one('functionalities', 'ACCOUNT_EXPIRATION').get().then(function(functionality) {
                var date = new Date();
                var delta = functionality.parameters[0].integer;
                if (functionality.parameters.string === 'DAY') {
                  date.setDay(date.getDay() + delta);
                } else if (functionality.parameters.string === 'WEEK') {
                  date.setWeek(date.getWeek() + delta);
                } else {
                  date.setMonth(date.getMonth() + delta);
                }
                $scope.limit = date;
              });
              Restangular.all('domains').all(newValue.domain).one('functionalities', 'RESTRICTED_GUEST').get().then(function(functionality) {
                if (functionality.activationPolicy.policy === 'ALLOWED') {
                  $scope.restrictedDisabled = false;
                } else {
                  $scope.restrictedDisabled = true;
                }
              });
              $scope.showUserEditForm = true;
            } else {
              $scope.showUserEditForm = false;
            }
          }, true);
          $scope.cancel = function() {
            $scope.user = {};
            $rootScope.$broadcast('reloadList');
          };
          $scope.reset = function() {
            angular.copy($scope.userToEdit, $scope.user);
          };
          $scope.users = function(pattern) {
            return Restangular.all('users').one('search', pattern).get();
          };
          $scope.submit = function(user) {
            $log.debug('user edition: ' + user.mail);
            if (!_.isEqual($scope.user.expirationDate, $scope.userToEdit.expirationDate)) {
              // Convert datepicker date in timestamp
              $scope.user.expirationDate = $scope.user.expirationDate.getTime();
            }
            angular.copy($scope.user, $scope.userToEdit);
            user.put().then(function success() {
              notificationService.addSuccess('P_Users-Management_UpdateSuccess');
            });
            $scope.cancel();
          };
          $scope.delete = function(user) {
            $log.debug('user deletion: ' + user.mail);
            user.remove().then(function success() {
              notificationService.addSuccess('P_Users-Management_DeleteSuccess');
            });
            $scope.cancel();
          };
        }
      ],
      templateUrl: '/views/templates/users/user_edit_form.html',
      replace: false
    };
  }
]);
