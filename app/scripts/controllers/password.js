'use strict';

angular.module('linshareAdminApp')
  .controller('PasswordCtrl',
    ['$scope', '$location', '$log', 'Authentication',
      function ($scope, $location, $log, Authentication) {
        function Rule(description, validator) {
          this.description = description;
          this.validator = function() {
            return validator();
          };
        }
        $scope.newPwdRetyped = '';
        $scope.password = {
          'oldPwd' : '',
          'newPwd' : ''
        };
        $scope.rules = [
          new Rule('Contain a symbol', function () {
            var pwd = $scope.password.newPwd;
            return pwd && /[$-/:-?{-~!"^_`\[\]]/g.test(pwd);
          }),
          new Rule('Length longer than 8 char', function () {
            var pwd = $scope.password.newPwd;
            return pwd && pwd.length >= 8;
          }),
          new Rule('Contain a digit', function () {
            var pwd = $scope.password.newPwd;
            return pwd && /[0-9]+/.test(pwd);
          }),
          new Rule('Contain an upper case character', function () {
            var pwd = $scope.password.newPwd;
            return pwd && /[A-Z]+/.test(pwd);
          }),
          new Rule('Contain a lower case character', function () {
            var pwd = $scope.password.newPwd;
            return pwd && /[a-z]+/.test(pwd);
          })
        ];
        $scope.match = function() {
          return !$scope.password.newPwd ||
                 !$scope.password.newPwd ||
                 $scope.password.newPwd === $scope.newPwdRetyped;
        };
        $scope.strengthScore = function() {
          var strength = 0;
          angular.forEach($scope.rules, function(r) {
            strength += r.validator();
          });
          return strength * 100 / $scope.rules.length;
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
