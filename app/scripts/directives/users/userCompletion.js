'use strict';

app.directive('lsUserCompletion', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope', '$log', 'Restangular',
        function($scope, $log, Restangular) {
          $scope.editUser = function() {
            $scope.selectedUser = Restangular.restangularizeElement(null, $scope.selected, 'users');
          };
          $scope.users = function(pattern) {
            return Restangular.all('users').one('search', pattern).get();
          }
        }
      ],
      templateUrl: '/views/templates/users/user_completion.html',
      replace: false
    };
  }
]);
