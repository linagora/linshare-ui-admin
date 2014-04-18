'use strict';

angular.module('linshareAdminApp').directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', 'Authentication', 'localize',
        function($scope, $log, Authentication, localize) {
          Authentication.getCurrentUser().then(function successCallback(user) {
            $scope.userLogged = user;
          });

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
