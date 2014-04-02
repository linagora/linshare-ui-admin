'use strict';

angular.module('myApp.controllers')
  .controller('ThreadCtrl',
    ['$scope', '$log', 'Thread',
      function ($scope, $log, Thread) {
        $scope.getCurrentThread = function() {
          return Thread.getCurrent();
        };
      }
    ]
  );
