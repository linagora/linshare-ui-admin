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
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService', 'notificationService',
        function($scope, $rootScope, Restangular, Logger, notificationService) {
          $scope.userRoles = Restangular.all('user_roles').getList();
          $scope.user = {};
          $scope.open = function() {
            $timeout(function() {
              $scope.opened = true;
            });
          };
          $scope.$watch('userToEdit', function(newValue, oldValue) {
            if (_.isObject(newValue)) {
              angular.copy(newValue, $scope.user);
            }
          }, true);
          $scope.$watch('user', function(newValue, oldValue) {
            if (_.isEmpty(newValue)) {
              $scope.showUserEditForm = false;
            } else {
              $scope.showUserEditForm = true;
            }
          }, true);
          $scope.cancel = function() {
            $scope.user = {};
            $rootScope.$broadcast('reloadList');
          };
          $scope.reset = function() {
            angular.copy($scope.userToEdit, $scope.user);
          };
          $scope.submit = function(user) {
            Logger.debug('user edition: ' + user.mail);
            if (!_.isEqual($scope.user.expirationDate, $scope.userToEdit.expirationDate)) {
              // Convert datepicker date in timestamp
              $scope.user.expirationDate = $scope.user.expirationDate.getTime();
            }
            angular.copy($scope.user, $scope.userToEdit);
            $scope.userToEdit.put();
            $scope.cancel();
            notificationService.addSuccess('P_Users-Management_UpdateSuccess');
          };
        }
      ],
      templateUrl: '/views/templates/users/user_edit_form.html',
      replace: false
    };
  }
]);
