'use strict';

app.controller('ThreadDetailCtrl', ['$scope', '$routeParams', 'threadService', 'loggerService',
  function($scope, $routeParams, Thread, Logger) {
    Thread.get({
      threadId: $routeParams.threadId
    }, function(data) {
      $scope.thread = data;
    }, function(err) {
      Logger.error('request failed' + err);
    });
  }
]);
