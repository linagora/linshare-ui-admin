'use strict';

app.directive('lsUserEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.showUserEditForm = false;
        scope.isGuest = function() {
          if (!_.isUndefined(scope.selectedUser)) {
            return scope.selectedUser.guest === true;
          }
        }
      },
      controller: ['$scope', 'Restangular', 'loggerService', 'notificationService',
        function($scope, Restangular, Logger, notificationService) {
          $scope.userRoles = Restangular.all('user_roles').getList();
          $scope.user = {};
          $scope.$watch('selectedUser', function(newValue, oldValue) {
            if (_.isUndefined(newValue) || !_.isObject(newValue)) {
              $scope.showUserEditForm = false;
            } else {
              $scope.showUserEditForm = true;
              angular.copy(newValue, $scope.user);
            }
          }, true);
          $scope.cancel = function() {
            $scope.selectedUser = undefined;
          }
          $scope.submit = function(user) {
            Logger.debug('user edition: ' + user.mail);
            angular.copy($scope.user, $scope.selectedUser);
            $scope.selectedUser.put();
            notificationService.addSuccess('P_Users-Management_UpdateSuccess');
          };
        }
      ],
      templateUrl: '/views/templates/users/user_edit_form.html',
      replace: false
    };
  }
]);
