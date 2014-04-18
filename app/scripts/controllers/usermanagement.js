'use strict';

angular.module('linshareAdminApp')
  .controller('UserManagementCtrl',
    ['$scope', '$log', 'User',
      function ($scope, $log, User) {
        $scope.getCurrentUser = function() {
          return User.getCurrent();
        };
      }
    ]
  );
