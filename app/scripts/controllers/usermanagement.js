'use strict';

angular.module('myApp.controllers')
  .controller('UserManagementCtrl',
    ['$scope', '$log', 'User',
      function ($scope, $log, User) {
        $scope.getCurrentUser = function() {
          return User.getCurrent();
        };
      }
    ]
  );
