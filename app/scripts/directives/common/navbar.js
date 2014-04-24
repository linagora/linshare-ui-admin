'use strict';

angular.module('linshareAdminApp').directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', '$translate', 'Authentication',
        function($scope, $log, $translate, Authentication) {
          Authentication.getCurrentUser().then(function successCallback(user) {
            $scope.userLogged = user;
          });

          $scope.setLanguage = function(value) {
            $translate.use(value);
          };

          $scope.isCurrentLang = function(value) {
            return $translate.use() === value;
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
