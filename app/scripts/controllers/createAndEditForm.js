'use strict';

app.controller('CreateAndEditFormCtrl', ['$scope',
  function($scope) {
    $scope.$on('showList', function() {
      $scope.switchView = false;
    });
  }
]);
