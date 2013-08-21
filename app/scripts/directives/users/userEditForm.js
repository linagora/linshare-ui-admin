'use strict';

app.directive('lsUserEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.isObject = function(myObject) {
          return _.isObject(myObject);
        }
        scope.isStringEmpty = function(myObject) {
          return _.isString(myObject) && _.isEmpty(myObject);
        }
      },
      controller: ['$scope', 'Restangular', 'loggerService', 'notificationService',
        function($scope, Restangular, Logger, notificationService) {
          $scope.userRoles = Restangular.all('user_roles').getList();
          $scope.cancel = function() {
            $scope.selectedUser = undefined;
          }
          $scope.submit = function(user) {
            Logger.debug('user edition: ' + user.mail);
            user.put();
            notificationService.addSuccess('P_Users-Management_UpdateSuccess');
          };
        }
      ],
      templateUrl: '/views/templates/users/user_edit_form.html',
      replace: false
    };
  }
]);
