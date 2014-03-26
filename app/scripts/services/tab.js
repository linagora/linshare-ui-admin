angular.module('myApp.services')
  .factory('Tab',
    ['$log', 'localize',
    function($log, localize) {
      this.domains = {
        name: localize.getLocalizedString('G_Tab_Domains'),
        links: [
          {
            name: localize.getLocalizedString('G_Tab_Domains-LDAPConnections'),
            href: '#domains/ldap_connections'
          }, {
            name: localize.getLocalizedString('G_Tab_Domains-DomainPatterns'),
            href: '#domains/domain_patterns'
          }, {
            name: localize.getLocalizedString('G_Tab_Domains-Management'),
            href: '#domains/management'
          }
        ]
      };
      this.administration = {
        name: localize.getLocalizedString('G_Tab_Administration'),
        links: [
          {
            name: localize.getLocalizedString('G_Tab_Administration-Functionalities'),
            href: '#administration/functionalities'
          }, {
            name: localize.getLocalizedString('G_Tab_Administration-MailsPersonalization'),
            href: '#administration/mails_personalization'
          }
        ]
      };
      this.users = {
        name: localize.getLocalizedString('G_Tab_Users'),
        links: [
          {
            name: localize.getLocalizedString('G_Tab_Users-Management'),
            href: '#users/management'
          }, 
        ]
      };
      this.threads = {
        name: localize.getLocalizedString('G_Tab_Users-Threads'),
        href: '#users/threads'
      };
      this.mailingLists = {
        name: localize.getLocalizedString('G_Tab_Users-MailingLists'),
        href: '#users/mailing_lists'
      };
      this.audit = {
        name: localize.getLocalizedString('G_Tab_Audit'),
        links: '#audit'
      };
      this.charts = {
        name: localize.getLocalizedString('G_Tab_Charts'),
        links: '#charts'
      };

      var self = this;

      // Public API here
      return {
        getAvailableTabs: function(user) {
          var tabs = [];

          if (user.role === 'SUPERADMIN') {
            tabs.push(self.domains);
          }
          tabs.push(self.administration);
          if (user.role === 'SUPERADMIN') {
            self.users.links.push(self.threads);
            self.users.links.push(self.mailingLists);
          }
          tabs.push(self.users);
          tabs.push(self.audit);
          // $scope.tabs.push($scope.menuCharts);
          return tabs;
        }
      };
    }
  ]
);
