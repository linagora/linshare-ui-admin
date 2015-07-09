'use strict';

angular.module('linshareAdminApp').directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$rootScope', '$scope', '$log', '$translate', 'tmhDynamicLocale', 'Authentication', 'lsAppConfig',
        function($rootScope, $scope, $log, $translate, tmhDynamicLocale, Authentication, lsAppConfig) {
          Authentication.getCurrentUser().then(function(user) {
            $scope.userLogged = user;
            $scope.isSuperAdmin = Authentication.isSuperAdmin(user);
          });
          $scope.license = lsAppConfig.license;
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
      templateUrl: 'ng_components/common/navbar.tpl.html',
      replace: false
    };
  }
]);
