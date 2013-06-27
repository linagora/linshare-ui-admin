'use strict';

app.directive('linshareLoginForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$http', 'authService',
        function($scope, $http, authService) {

          $scope.submit = function() {
            $http.post('auth/login').success(function() {
              authService.loginConfirmed();
            });
          }

          $scope.$on('event:auth-loginRequired', function() {
            $scope.loginModal = true;
          });

          $scope.$on('event:auth-loginConfirmed', function() {
            $scope.loginModal = false;
          });

          $scope.opts = {
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
