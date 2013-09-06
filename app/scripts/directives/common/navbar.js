'use strict';

app.directive('lsNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$route', '$http', 'localize', 'preferencesService',
        function($scope, $route, $http, Localize, Preferences) {
          $scope.menuDomains = {
                name: Localize.getLocalizedString('G_Tab_Domains'),
                links: [{
                    name: Localize.getLocalizedString('G_Tab_Domains-LDAPConnections'),
                    href: '#domains/ldap_connections'
                  }, {
                    name: Localize.getLocalizedString('G_Tab_Domains-DomainPatterns'),
                    href: '#domains/domain_patterns'
                  }, {
                    name: Localize.getLocalizedString('G_Tab_Domains-Management'),
                    href: '#domains/management'
                  }
                ]
              };
          $scope.menuThreads = {
              name: Localize.getLocalizedString('G_Tab_Threads'),
              links: [{
                  name: "THREADS (TODO)",
                  href: '#threads'
                  }
                ]
              };
          $scope.menuAdministration = {
              name: Localize.getLocalizedString('G_Tab_Administration'),
              links: [{
                  name: Localize.getLocalizedString('G_Tab_Administration-Functionalities'),
                  href: '#administration/functionalities'
                }, {
                  name: Localize.getLocalizedString('G_Tab_Administration-MailsPersonalization'),
                  href: '#administration/mails_personalization'
                }
              ]
            };
          $scope.menuUsers = {
              name: Localize.getLocalizedString('G_Tab_Users'),
              links: [{
                  name: Localize.getLocalizedString('G_Tab_Users-Management'),
                  href: '#users/management'
                }
              ]
            };
          $scope.menuMailingLists = {
              name: Localize.getLocalizedString('G_Tab_MailingLists'),
              links: '#mailing_lists'
            };
          $scope.menuAudit = {
              name: Localize.getLocalizedString('G_Tab_Audit'),
              links: '#audit'
            };
          $scope.menuCharts= {
              name: Localize.getLocalizedString('G_Tab_Charts'),
              links: '#charts'
            };

          $scope.tabs = [];
          $scope.appName = Preferences.system.appName;

          var tabAdded = false;
          $scope.$watch('userLogged', function(newValue, oldValue) {
            if (!_.isEmpty(newValue) && !tabAdded) {
              $scope.tabs = [];
              if(newValue.role === 'SUPERADMIN') {
                $scope.tabs.push($scope.menuDomains);
              }
              $scope.tabs.push($scope.menuAdministration);
              $scope.tabs.push($scope.menuUsers);
              if(newValue.role === 'SUPERADMIN') {
                $scope.tabs.push($scope.menuThreads);
              }
              $scope.tabs.push($scope.menuMailingLists);
              $scope.tabs.push($scope.menuAudit);
              $scope.tabs.push($scope.menuCharts);
              tabAdded = true;
            }
          }, true);

          $scope.setLanguage = function(value) {
            Localize.setLanguage(value);
          };

          $scope.isCurrentLang = function(value) {
            return Localize.getSimpleLanguage() === value;
          };

          $scope.logout = function() {
            $http.get('linshare/j_spring_security_logout').success(function() {
              console.debug("logout");
              $route.reload();
            }).error(function() {
              console.error("Unable to reach logout url");
            });
          }
        }
      ],
      templateUrl: '/views/templates/common/navbar.html',
      replace: false
    };
  }
]);
