'use strict';

app.directive('linshareAutocompleteUser', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.userRepresentation = function(user) {
          if (!_.isUndefined(user)) {
            return user.firstName + ' ' + user.lastName + ' <' + user.mail + '>';
          }
        }
      },
      controller: ['$scope', 'Restangular', 'loggerService',
        function($scope, Restangular, Logger) {
          $scope.users = function(pattern) {
            return Restangular.all('users').one('search', pattern).get().then(function success(users) {
              var restangularCollection = [];
              angular.forEach(users, function(user, key) {
                restangularCollection.push(Restangular.restangularizeElement(null, user, 'users'));
              });
              return restangularCollection;
            }, function error() {
            });
          }
          $scope.isObject = function(myObject) {
            return _.isObject(myObject);
          }
          $scope.isStringEmpty = function(myObject) {
            return _.isString(myObject) && _.isEmpty(myObject);
          }
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
          $scope.submit = function(userEditForm, user) {
            if (userEditForm.$valid) {
              Logger.debug('user edition :' + user.mail);
              user.put();
            }
          };
        }
      ],
      templateUrl: '/views/templates/autocomplete_user.html',
      replace: false
    };
  }
]);
