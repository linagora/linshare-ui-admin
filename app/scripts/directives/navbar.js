'use strict';

app.directive('linshareNavbar', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', '$route', '$http', 'localize', 'preferencesService',
        function($scope, $route, $http, Localize, Preferences) {
          $scope.appName = Preferences.system.appName;

          $scope.tabs = [{
              name: Localize.getLocalizedString('G_Tab_Domains'),
              links: [{
                name: Localize.getLocalizedString('P_Domains_LDAPConnections'),
                href: '#domains/ldap_connections'
              }, {
                name: Localize.getLocalizedString('P_Domains_DomainPatterns'),
                href: '#domains/domain_patterns'
              }, {
                name: Localize.getLocalizedString('P_Domains_Management'),
                href: '#domains/management'
              }]
            }, {
              name: Localize.getLocalizedString('G_Tab_Administration'),
              links: [{
                name: Localize.getLocalizedString('P_Administration_ActivationPolicies'),
                href: '#administration/activation_policies'
              }, {
                name: Localize.getLocalizedString('P_Administration_ConfigurationPolicies'),
                href: '#administration/configuration_policies'
              }, {
                name: Localize.getLocalizedString('P_Administration_MailsPersonalization'),
                href: '#administration/mails_personalization'
              }]
            }, {
              name: Localize.getLocalizedString('G_Tab_Users'),
              links: '#users'
            }, {
              name: Localize.getLocalizedString('G_Tab_Threads'),
              links: '#threads'
            }, {
              name: Localize.getLocalizedString('G_Tab_MailingLists'),
              links: '#mailing_lists'
            }, {
              name: Localize.getLocalizedString('G_Tab_Audit'),
              links: '#audit'
            }, {
              name: Localize.getLocalizedString('G_Tab_Charts'),
              links: '#charts'
            }
          ];

          $scope.isCurrent = false;

          $scope.setLanguage = function(value) {
            Localize.setLanguage(value);
          }

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
      templateUrl: '/views/templates/navbar.html',
      replace: false
    };
  }
]);
