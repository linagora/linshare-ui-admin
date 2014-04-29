'use strict';

angular.module('linshareAdminApp')
  .controller('PasswordCtrl',
    ['$scope', '$location', '$log', 'Authentication',
      function ($scope, $location, $log, Authentication) {
        function Rule(description, validator) {
          this.description = description;
          this.className = function () {
            return validator() ? "icon-check" : "icon-exclamation-sign";
          }
        }
        $scope.newPwdRetyped = '';
        $scope.password = {
          'oldPwd' : '',
          'newPwd' : ''
        };
        $scope.rules = [
          new Rule('Contain a digit', function () {
            return $scope.password.newPwd.match(/[0-9]/);
          }),
          new Rule('Contain an upper case character', function () {
            return $scope.password.newPwd.match(/[A-Z]/);
          }),
          new Rule('Contain a lower case character', function () {
            return $scope.password.newPwd.match(/[a-z]/);
          })
        ];
        $scope.match = function() {
          return !$scope.password.newPwd ||
                 !$scope.password.newPwd ||
                 $scope.password.newPwd == $scope.newPwdRetyped;
        };
        $scope.redirectToHome = function () {
          $location.path('/');
        };
        $scope.submit = function() {
          Authentication.changePassword($scope.password, function successCallback() {
            $location.path('/');
          });
        };
      }
    ]
  );
