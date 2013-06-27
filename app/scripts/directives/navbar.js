'use strict';

app.directive('linshareNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$location', '$http', 'localize', 'preferencesService',
        function($scope, $location, $http, Localize, Preferences) {
          $scope.appName = Preferences.system.appName;

          $scope.tabs = [{
              name: Localize.getLocalizedString('G_Tab_SharedFiles'),
              href: '#shared_files'
            }, {
              name: Localize.getLocalizedString('G_Tab_UploadedFiles'),
              href: '#uploaded_files'
            }, {
              name: Localize.getLocalizedString('G_Tab_Users'),
              href: '#users'
            }, {
              name: Localize.getLocalizedString('G_Tab_Upload'),
              href: '#upload'
            }, {
              name: Localize.getLocalizedString('G_Tab_Threads'),
              href: '#threads'
            }, {
              name: 'Tree',
              href: '#tree'
            }
          ];
          $scope.isCurrent = function(index) {
            var path = $scope.tabs[index].href;
            var currentPath = '#' + $location.path();
            return (currentPath == path);
          };

          $scope.setLanguage = function(value) {
            Localize.setLanguage(value);
          }

          $scope.logout = function() {
            $http.get('linshare/j_spring_security_logout').success(function() {
              console.debug("logout");
              location.reload();
            }).error(function() {
              console.error("Unable to reach logout url");
            });
          }
        }
      ],
      templateUrl: '/views/templates/navbar.html',
      replace: false
    };
  }
]);
