'use strict';

app.directive('lsUserEditForm', ['$timeout', 
  function($timeout) {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.showUserEditForm = false;
        scope.isGuest = function() {
          if (!_.isUndefined(scope.selectedUser)) {
            return scope.selectedUser.guest === true;
          }
        };
        scope.today = new Date();
      },
      controller: ['$scope', 'Restangular', 'loggerService', 'notificationService',
        function($scope, Restangular, Logger, notificationService) {
          $scope.userRoles = Restangular.all('user_roles').getList();
          $scope.user = {};
          $scope.open = function() {
            $timeout(function() {
              $scope.opened = true;
            });
          };
          $scope.$watch('selectedUser', function(newValue, oldValue) {
            if (_.isUndefined(newValue) || !_.isObject(newValue)) {
              $scope.showUserEditForm = false;
            } else {
              $scope.showUserEditForm = true;
              angular.copy(newValue, $scope.user);
            }
          }, true);
          $scope.cancel = function() {
            Logger.debug('VOUS ETES ICI');
            $scope.selectedUser = undefined;
            $scope.selected = undefined;
          }
          $scope.submit = function(user) {
            Logger.debug('user edition: ' + user.mail);
            if (!_.isEqual($scope.user.expirationDate,$scope.selectedUser.expirationDate)) {
              // Convert datepicker date in timestamp
              $scope.user.expirationDate = $scope.user.expirationDate.getTime();
            }
            angular.copy($scope.user, $scope.selectedUser);
            $scope.selectedUser.put();
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
