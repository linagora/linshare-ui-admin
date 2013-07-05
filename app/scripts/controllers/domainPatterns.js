'use strict';

app.controller('DomainPatternsCtrl', ['$scope', '$route', 'Restangular', 'loggerService',
  function($scope, $route, Restangular, Logger) {
    $scope.update = function(domainPattern) {
      Restangular.all('admin').all('domain_patterns').getList().then(function successCallback() {
        domainPattern.put();
        // refresh the page
        $route.reload();
      }, function errorCallback() {
        Logger.error('DomainPatternsCtrl: unable to get domain patterns list');
      });
    }
    $scope.reset = function() {
      $scope.domainPattern = angular.copy($scope.myElement);
    };

    // Save the previous state
    $scope.reset();
  }
]);
