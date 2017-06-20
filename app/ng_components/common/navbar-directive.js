'use strict';

angular.module('linshareAdminApp').directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$q', '$rootScope', '$scope', '$log', '$translate', 'tmhDynamicLocale', 'Authentication',
        'lsAppConfig', 'upgradeTasksConstants', 'upgradeTasksRestService',
        function($q, $rootScope, $scope, $log, $translate, tmhDynamicLocale, Authentication, lsAppConfig,
          upgradeTasksConstants, upgradeTasksRestService) {
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
          };

          $scope.upgradeTasks = {
            criticality: upgradeTasksConstants.criticality,
            getCriticality: function() {
              var crit = {order: -1};
              _.forEach(upgradeTasksConstants.criticality, function(criticality) {
                if (_.some($scope.upgradeTasks.list, {
                    criticality: criticality.value
                  }) && criticality.order > crit.order) {
                  crit = criticality;
                }
              });
              return crit.value;
            },
            getList: function(refresh) {
              var deferred = $q.defer();
              if (_.isUndefined($scope.upgradeTasks.list) || refresh) {
                upgradeTasksRestService.getList().then(function(upgradeTasksData) {
                  $scope.upgradeTasks.list = upgradeTasksData;
                  deferred.resolve($scope.upgradeTasks.list);
                });
              } else {
                deferred.resolve($scope.upgradeTasks.list);
              }
              return deferred.promise;
            },
            hasSome: function() {
              return _.some($scope.upgradeTasks.list, {
                status: $scope.upgradeTasks.status.NEW
              });
            },
            status: upgradeTasksConstants.status
          };
          $scope.upgradeTasks.getList();
        }
      ],
      templateUrl: 'ng_components/common/navbar.tpl.html',
      replace: false
    };
  }
]);
