'use strict';

app.directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', 'Authentication', 'localize',
        function($scope, $log, Authentication, localize) {
          $scope.$watch(Authentication.getCurrentUser,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.userLogged = newValue;
              }
            },
            true
          );

          $scope.setLanguage = function(value) {
            localize.setLanguage(value);
          };

          $scope.isCurrentLang = function(value) {
            return localize.getSimpleLanguage() === value;
          };

          $scope.logout = function() {
            Authentication.logout();
          }
        }
      ],
      templateUrl: '/views/templates/common/navbar.html',
      replace: false
    };
  }
]);
