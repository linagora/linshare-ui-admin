'use strict';

app.controller('LoginCtrl', ['$scope', '$http', 'authService', 'loggerService',
  function($scope, $http, authService, Logger) {

    $scope.submit = function() {
      $http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode($scope.login + ':' + $scope.password);
      $http({
        method: 'GET',
        url: 'linshare/webservice/rest/users/authorized',
        ignoreAuthModule: true
      }).
      success(function(data, status, headers, config) {
        Logger.debug("We are logged");
        authService.loginConfirmed();
      }).
      error(function(data, status, headers, config) {
        $scope.errorLogin = "Bad credentials";
        Logger.debug("We are not logged");
      });
    }
  }
]);
