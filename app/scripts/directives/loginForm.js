'use strict';

app.directive('lsLoginForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'Restangular', 'authService', 'loggerService',
        function($scope, Restangular, authService, Logger) {

          $scope.submit = function() {
            var success = function(data, status, headers, config) {
              Logger.debug("Authentication succeed");
              authService.loginConfirmed();
            };
            var error = function(data, status, headers, config) {
              $scope.errorLogin = "Bad credentials";
              Logger.debug("Authentication failed");
            };

            Restangular.all('authentication').customGET('authorized', {
              // QueryParams - Bypass the module authService
              ignoreAuthModule: true
            }, {
              // Headers - Add login password
              Authorization: 'Basic ' + Base64.encode($scope.login + ':' + $scope.password)
            }).then(success, error);
          }

          $scope.$on('event:auth-loginRequired', function() {
            $scope.loginModal = true;
          });

          $scope.$on('event:auth-loginConfirmed', function() {
            $scope.loginModal = false;
          });

          $scope.opts = {
            backdropClick:false,
            keyboard: false,
            backdropFade: true,
            dialogFade: true
          };
        }
      ],
      templateUrl: '/views/templates/login_form.html',
      replace: false
    };
  }
]);
