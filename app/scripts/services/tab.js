'use strict';

angular.module('linshareAdminApp')
  .factory('Tab',
    ['$log', '$translate',
    function($log, $translate) {
      this.domains = {
        name: $translate('G_Tab_Domains'),
        icon: 'fa-cloud',
        links: [
          {
            name: $translate('COMMON.TAB.LDAP_CONNECTIONS'),
            href: '#domains/ldap_connections'
          }, {
            name: $translate('COMMON.TAB.DOMAIN_PATTERNS'),
            href: '#domains/domain_patterns'
          }, {
            name: $translate('COMMON.TAB.MANAGE_DOMAINS'),
            href: '#domains/management'
          }, {
            name: $translate('COMMON.TAB.DOMAIN_ORDER'),
            href: '#domains/order'
          }, {
            name: $translate('COMMON.TAB.DOMAIN_POLICIES'),
            href: '#domains/policies'
          }
        ]
      };
      this.parameters = {
        name: $translate('COMMON.TAB.PARAMETERS'),
        icon: 'fa-gears',
        links: [
          {
            name: $translate('COMMON.TAB.FUNCTIONALITIES'),
            href: '#parameters/functionalities'
          }, {
            name: $translate('COMMON.TAB.MAILS_CONFIGURATION'),
            href: '#parameters/mails_personalization'
          }
        ]
      };
      this.users = {
        name: $translate('COMMON.TAB.USERS'),
        icon: 'fa-users',
        links: [
          {
            name: $translate('COMMON.TAB.MANAGE_USERS'),
            href: '#users/management'
          }, {
            name: $translate('COMMON.TAB.INCONSISTENT_USERS'),
            href: '#users/inconsistent'
          }
        ]
      };
      this.threads = {
        name: $translate('COMMON.TAB.THREADS'),
        href: '#users/threads'
      };
      this.mailingLists = {
        name: $translate('COMMON.TAB.MAILING_LISTS'),
        href: '#users/mailing_lists'
      };
      this.audit = {
        name: $translate('COMMON.TAB.HISTORY'),
        icon: 'fa-archive',
        links: [
          {
            name: $translate('COMMON.TAB.AUDIT'),
            href: '#history/audit'
          }
        ]
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
          return tabs;
        }
      };
    }
  ]
);
