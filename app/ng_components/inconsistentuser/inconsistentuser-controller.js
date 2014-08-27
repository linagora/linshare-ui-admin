'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserCtrl',
    ['$scope', '$log', 'User',
      function ($scope, $log, User) {
        $scope.getCurrentUser = function() {
          return User.getCurrent();
        };
      }
    ]
  );
