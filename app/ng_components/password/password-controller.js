'use strict';

angular.module('linshareAdminApp')
  .controller('PasswordCtrl',
    ['$scope', '$location', '$log', 'Authentication', 'Password',
      function($scope, $location, $log, Authentication, Password) {
        $scope.newPwdRetyped = '';
        $scope.password = {
          'oldPwd' : '',
          'newPwd' : ''
        };
        $scope.match = function(a, b) {
          return Password.match(a, b);
        };
        $scope.strengthScore = function(password) {
          return Password.strengthScore(password);
        };
        $scope.redirectToHome = function() {
          $location.path('/');
        };
        $scope.submit = function() {
          Authentication.changePassword($scope.password).then(function() {
            $location.path('/');
          });
        };
      }
    ]
  );
