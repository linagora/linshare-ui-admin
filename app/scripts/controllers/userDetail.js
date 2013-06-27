'use strict';

app.controller('UserDetailCtrl', ['$scope', '$routeParams', 'userService', 'loggerService',
  function($scope, $routeParams, User, Logger) {
    User.get({
      userId: $routeParams.userId
    }, function(data) {
      $scope.user = data;
    }, function(err) {
      Logger.error('request failed' + err);
    });
  }
]);
