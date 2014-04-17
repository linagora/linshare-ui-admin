'use strict';

angular.module('linshareUiAdmin')
  .factory('Tab',
    ['$log', 'localize',
    function($log, localize) {
      this.domains = {
        name: localize.getLocalizedString('G_Tab_Domains'),
        icon: 'fa-cloud',
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
          }, {
            name: localize.getLocalizedString('G_Tab_Domains-Order'),
            href: '#domains/order'
          }, {
            name: localize.getLocalizedString('G_Tab_Domains-Policies'),
            href: '#domains/policies'
          }
        ]
      };
      this.parameters = {
        name: localize.getLocalizedString('G_Tab_Parameters'),
        icon: 'fa-gears',
        links: [
          {
            name: localize.getLocalizedString('G_Tab_Parameters-Functionalities'),
            href: '#parameters/functionalities'
          }, {
            name: localize.getLocalizedString('G_Tab_Parameters-MailsPersonalization'),
            href: '#parameters/mails_personalization'
          }
        ]
      };
      this.users = {
        name: localize.getLocalizedString('G_Tab_Users'),
        icon: 'fa-users',
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
        name: localize.getLocalizedString('G_Tab_Users-Mails'),
        href: '#users/mailing_lists'
      };
      this.audit = {
        name: localize.getLocalizedString('G_Tab_History'),
        icon: 'fa-archive',
        links: [
          {
            name: localize.getLocalizedString('G_Tab_History-Audit'),
            href: '#history/audit'
          }
        ]
      };
      this.charts = {
        name: localize.getLocalizedString('G_Tab_Charts'),
        icon: 'fa-bar-chart-o',
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
          tabs.push(self.parameters);
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
