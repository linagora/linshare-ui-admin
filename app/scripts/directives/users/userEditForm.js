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
      controller: ['$scope', 'Restangular', 'loggerService',
        function($scope, Restangular, Logger) {
          $scope.userRoles = Restangular.all('user_roles').getList().then(function success(userRoles) {
            var myArray = [];
            angular.forEach(userRoles, function(userRole, key) {
              if (userRole != 'SYSTEM' && userRole != 'SUPERADMIN') {
                myArray.push(userRole);
              }
            });
            return myArray;
          }, function error() {
            Logger.error('Unable to get user roles list');
          });
          $scope.submit = function(user) {
            Logger.debug('user edition :' + user.mail);
            Logger.debug(user);
            user.put();
          };
        }
      ],
      templateUrl: '/views/templates/users/user_edit_form.html',
      replace: false
    };
  }
]);
