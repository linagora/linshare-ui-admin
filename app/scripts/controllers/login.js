'use strict';

app.controller('LoginCtrl', ['$scope', 'Restangular', 'authService', 'loggerService',
  function($scope, Restangular, authService, Logger) {
    $scope.submit = function() {
      Restangular.all('admin').customGET('authorized', {
        ignoreAuthModule: true
      }, {
        Authorization: 'Basic ' + Base64.encode($scope.login + ':' + $scope.password)
      }).then(function(data, status, headers, config) {
        Logger.debug("We are logged");
        authService.loginConfirmed();
      }, function(data, status, headers, config) {
        $scope.errorLogin = "Bad credentials";
        Logger.debug("We are not logged");
      });
    }
  }
]);
