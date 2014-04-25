'use strict';

angular.module('linshareAdminApp').directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$rootScope', '$scope', '$log', '$translate', 'tmhDynamicLocale', 'Authentication',
        function($rootScope, $scope, $log, $translate, tmhDynamicLocale, Authentication) {
          Authentication.getCurrentUser().then(function successCallback(user) {
            $scope.userLogged = user;
          });

          $scope.setLanguage = function(value) {
            $translate.use(value);
          };

          $rootScope.$on('$translateChangeSuccess', function() {
            var lang = $translate.use();
            $log.debug('Language: switched to ' + lang);
            tmhDynamicLocale.set(lang);
          });

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
