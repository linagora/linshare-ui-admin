'use strict';

angular.module('linshareUiAdmin')
  .controller('UserManagementCtrl',
    ['$scope', '$log', 'User',
      function ($scope, $log, User) {
        $scope.getCurrentUser = function() {
          return User.getCurrent();
        };
      }
    ]
  );
