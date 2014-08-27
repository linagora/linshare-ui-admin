'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadCtrl',
    ['$scope', '$log', 'Thread',
      function ($scope, $log, Thread) {
        $scope.getCurrentThread = function() {
          return Thread.getCurrent();
        };
      }
    ]
  );
