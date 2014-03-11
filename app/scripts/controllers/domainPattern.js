'use strict';

app.controller('DomainPatternCtrl', ['$scope', 'loggerService',
  function($scope, Logger) {
    $scope.$watch('selectedDomainPattern', function(newValue) {
      Logger.debug('Change domain pattern');
      $scope.domainPatternToEdit = newValue;
    });
  }
]);
