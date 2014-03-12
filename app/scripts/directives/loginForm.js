'use strict';

app.directive('lsLoginForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'authService',
        function($scope, $rootScope, $log, Restangular, authService) {

          $scope.submit = function() {
            var success = function(data) {
              $log.debug('Authentication succeed');
              authService.loginConfirmed(data);
              $log.debug('Connected as ' + data.mail);
              $log.debug('data' + data);
            };
            var error = function(data) {
              $scope.errorLogin = 'Bad credentials';
              $log.debug('Authentication failed');
              $log.debug('data' + data);
            };

            Restangular.all('authentication').customGET('authorized', {
              // QueryParams - Bypass the module authService
              ignoreAuthModule: true
            }, {
              // Headers - Add login password
              Authorization: 'Basic ' + Base64.encode($scope.login + ':' + $scope.password)
            }).then(success, error);
          };

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
