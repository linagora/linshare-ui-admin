angular.module('myApp.services')
  .factory('Tab',
    ['$log', 'localize',
    function($log, Localize) {
      this.domains = {
        name: Localize.getLocalizedString('G_Tab_Domains'),
        links: [
          {
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
      this.threads = {
        name: Localize.getLocalizedString('G_Tab_Threads'),
        links: [
          {
            name: Localize.getLocalizedString('G_Tab_Threads-Management'),
            href: '#threads'
          }
        ]
      };
      this.administration = {
        name: Localize.getLocalizedString('G_Tab_Administration'),
        links: [
          {
            name: Localize.getLocalizedString('G_Tab_Administration-Functionalities'),
            href: '#administration/functionalities'
          }, {
            name: Localize.getLocalizedString('G_Tab_Administration-MailsPersonalization'),
            href: '#administration/mails_personalization'
          }
        ]
      };
      this.users = {
        name: Localize.getLocalizedString('G_Tab_Users'),
        links: [
          {
            name: Localize.getLocalizedString('G_Tab_Users-Management'),
            href: '#users/management'
          }
        ]
      };
      this.mailingLists = {
        name: Localize.getLocalizedString('G_Tab_MailingLists'),
        links: '#mailing_lists'
      };
      this.audit = {
        name: Localize.getLocalizedString('G_Tab_Audit'),
        links: '#audit'
      };
      this.charts = {
        name: Localize.getLocalizedString('G_Tab_Charts'),
        links: '#charts'
      };

      var self = this;

      // Public API here
      return {
        getAvailableTabs: function(user) {
          var tabs = [];
          if(user.role === 'SUPERADMIN') {
            tabs.push(self.domains);
          }
          tabs.push(self.administration);
          tabs.push(self.users);
          if(user.role === 'SUPERADMIN') {
            tabs.push(self.threads);
          }
          // $scope.tabs.push($scope.menuMailingLists);
          tabs.push(self.audit);
          // $scope.tabs.push($scope.menuCharts);
          return tabs;
        }
      };
    }
  ]
);
