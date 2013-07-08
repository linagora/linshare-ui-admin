'use strict';

app.controller('DomainPatternsCtrl', ['$scope', '$route', 'Restangular', 'loggerService',
  function($scope, $route, Restangular, Logger) {
    $scope.update = function(domainPattern) {
      domainPattern.put().then(function successCallback(domainPatterns) {
        // refresh the page
        $route.reload();
      }, function errorCallback() {
        Logger.error('Unable to get domain patterns list');
      });
    }
    $scope.reset = function() {
      $scope.domainPattern = Restangular.copy($scope.myElement);
    };

    // Save the previous state
    $scope.reset();
  }
]);
