'use strict';

app.controller('UserManagementCtrl', ['$scope',
  function($scope) {
    $scope.$watch('selected', function(newValue, oldValue) {
      $scope.selectedUser = newValue;
    });
  }
]);
