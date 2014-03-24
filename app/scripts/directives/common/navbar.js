'use strict';

app.directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$log', 'Authentication', 'localize', 'preferencesService', 'Tab',
        function($scope, $log, Authentication, Localize, Preferences, Tab) {
          $scope.appName = Preferences.system.appName;

          $scope.$watch(Authentication.getCurrentUser,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.userLogged = newValue;
                $scope.tabs = Tab.getAvailableTabs(newValue);
              }
            },
            true
          );

          $scope.setLanguage = function(value) {
            Localize.setLanguage(value);
          };

          $scope.isCurrentLang = function(value) {
            return Localize.getSimpleLanguage() === value;
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
