'use strict';

app.controller('LoginCtrl', ['$scope', 'Restangular', 'authService', 'loggerService',
  function($scope, Restangular, authService, Logger) {
    $scope.submit = function() {
      var successCallback = function(data, status, headers, config) {
        Logger.debug("We are logged");
        authService.loginConfirmed();
      };
      var errorCallback = function(data, status, headers, config) {
        $scope.errorLogin = "Bad credentials";
        Logger.debug("We are not logged");
      };
    
      Restangular.all('admin').customGET('authorized', {
        // QueryParams - Bypass the module authService
        ignoreAuthModule: true
      }, {
        // Headers - Add login password
        Authorization: 'Basic ' + Base64.encode($scope.login + ':' + $scope.password)
      }).then(successCallback, errorCallback);
    }
  }
]);
