'use strict';

app.controller('DomainPatternCtrl', ['$scope', '$log',
  function($scope, $log) {
    $scope.$watch('selectedDomainPattern', function(newValue) {
      $log.debug('Change domain pattern');
      $scope.domainPatternToEdit = newValue;
    });
  }
]);
