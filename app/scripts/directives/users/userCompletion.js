'use strict';

app.directive('lsUserCompletion', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.searching = false;
      },
      controller: ['$scope', 'Restangular', 'loggerService',
        function($scope, Restangular, Logger) {
          $scope.selectedUser = {};
          $scope.$watch('selected', function(newValue, oldValue) {
            if (_.isObject(newValue)) {
              $scope.selectedUser = newValue;
            } else {
              $scope.selectedUser = {};
            }
          }, true);
          $scope.users = function(pattern) {
            $scope.searching = true;
            return Restangular.all('users').one('search', pattern).get().then(function success(users) {
              var restangularCollection = [];
              angular.forEach(users, function(user, key) {
                restangularCollection.push(Restangular.restangularizeElement(null, user, 'users'));
              });
              $scope.searching = false;
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
