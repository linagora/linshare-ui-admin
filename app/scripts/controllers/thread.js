'use strict';

angular.module('linshareUiAdmin')
  .controller('ThreadCtrl',
    ['$scope', '$log', 'Thread',
      function ($scope, $log, Thread) {
        $scope.getCurrentThread = function() {
          return Thread.getCurrent();
        };
      }
    ]
  );
