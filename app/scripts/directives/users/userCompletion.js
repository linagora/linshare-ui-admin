'use strict';

app.directive('lsUserCompletion', [
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
            });
          }
        }
      ],
      templateUrl: '/views/templates/users/user_completion.html',
      replace: false
    };
  }
]);
