'use strict';

app.controller('UserManagementCtrl', ['$scope',
  function($scope) {
    $scope.$watch('selectedUser', function(newValue, oldValue) {
      $scope.user = newValue;
    });
  }
]);
