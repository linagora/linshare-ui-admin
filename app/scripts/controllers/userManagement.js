'use strict';

app.controller('UserManagementCtrl', ['$scope',
  function($scope) {
    $scope.userRepresentation = function(user) {
      if (angular.isDefined(user)) {
        return user.firstName + ' ' + user.lastName + ' <' + user.mail + '>';
      }
    };
  }
]);
