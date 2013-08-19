'use strict';

app.controller('DomainPatternCtrl', ['$scope', 'loggerService',
  function($scope, Logger) {
    $scope.$watch('selectedDomainPattern', function(newValue) {
      $scope.domainPatternToEdit = newValue;
    });
  }
]);
