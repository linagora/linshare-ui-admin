'use strict';

angular.module('linshareAdminApp').directive('lsSidebar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: [
        '_',
        '$rootScope',
        '$scope',
        '$state',
        'Authentication',
        'Tab',
        'Languages',
        '$http',
        'lsAppConfig',
        function(
          _,
          $rootScope,
          $scope,
          $state,
          Authentication,
          Tab,
          Languages,
          $http,
          lsAppConfig
        ) {
          var setActiveSection = function(link, value) {
            $scope.linkActive = link;
            value.isopen = true;
          };
          var compareCurrentStateToTab = function(currentState) {
            angular.forEach($scope.tabs, function(value) {
              angular.forEach(value.links, function(link) {
                if (currentState === link.sref) {
                  setActiveSection(link.sref, value);
                } else if (link.childrenSref) {
                  angular.forEach(link.childrenSref, function(subLink) {
                    if (currentState === link.sref || currentState === subLink) {
                      setActiveSection(link.sref, value);
                    }
                  });
                }
              });
            });
          };
          Authentication.getCurrentUser().then(function(user) {
            $scope.tabs = Tab.getAvailableTabs(user);
            $scope.linkActive = false;
            $scope.userDomain = user.domain;
            $rootScope.$on('$stateChangeStart',function(event, toState){
              compareCurrentStateToTab(toState.name);
            });
            if ($scope.linkActive === false){
              compareCurrentStateToTab($state.next.name);
            }
          });
          Authentication.version().then(function(version){
            $scope.coreVersion = version;
          });
          $scope.productVersion = 'dev';
          $http.get('/about.json').success(function(data) {
            $scope.productVersion = data.version;
          });
          $scope.$watch('search', function(newValue) {
            var inSearch = !_.isEmpty(newValue);
            angular.forEach($scope.tabs, function(value) {
              value.isopen = inSearch;
            });
          });
          $scope.language = Languages.getCurrentLang().filter;
          $scope.legacyMode = lsAppConfig.legacyMode;
        }
      ],
      templateUrl: 'ng_components/common/sidebar.tpl.html',
      replace: false
    };
  }
]);

