'use strict';

app.directive('linshareLoginForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'Restangular', 'authService', 'loggerService',
        function($scope, Restangular, authService, Logger) {

          $scope.submit = function() {
            var successCallback = function(data, status, headers, config) {
              Logger.debug("Authentication succeed");
              authService.loginConfirmed();
            };
            var errorCallback = function(data, status, headers, config) {
              $scope.errorLogin = "Bad credentials";
              Logger.debug("Authentication failed");
            };

            Restangular.all('admin').customGET('authorized', {
              // QueryParams - Bypass the module authService
              ignoreAuthModule: true
            }, {
              // Headers - Add login password
              Authorization: 'Basic ' + Base64.encode($scope.login + ':' + $scope.password)
            }).then(successCallback, errorCallback);
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
      templateUrl: '/views/templates/login_modal.html',
      replace: false
    };
  }
]);
