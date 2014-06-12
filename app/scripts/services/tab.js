'use strict';

angular.module('linshareAdminApp')
  .factory('Tab',
    ['$log', 'Authentication',
    function($log, Authentication) {
      this.domains = {
        name: 'COMMON.TAB.DOMAINS',
        icon: 'fa-cloud',
        links: [
          {
            name: 'COMMON.TAB.LDAP_CONNECTIONS',
            href: '#domains/ldap_connections'
          }, {
            name: 'COMMON.TAB.DOMAIN_PATTERNS',
            href: '#domains/domain_patterns'
          }, {
            name: 'COMMON.TAB.MANAGE_DOMAINS',
            href: '#domains/management'
          }, {
            name: 'COMMON.TAB.DOMAIN_ORDER',
            href: '#domains/order'
          }, {
            name: 'COMMON.TAB.DOMAIN_POLICIES',
            href: '#domains/policies'
          }
        ]
      };
      this.mails = {
        name: 'COMMON.TAB.MAILS',
        icon: 'fa-envelope',
        links: [
          {
            name: 'COMMON.TAB.MAIL_LAYOUT',
            href: '#parameters/mail_layout'
          }, {
            name: 'COMMON.TAB.MAIL_FOOTER',
            href: '#parameters/mail_footer'
          }, {
            name: 'COMMON.TAB.MAIL_CONTENT',
            href: '#parameters/mail_content'
          }, {
            name: 'COMMON.TAB.MAIL_CONFIG',
            href: '#parameters/mail_config'
          }
        ]
      };
      this.parameters = {
        name: 'COMMON.TAB.PARAMETERS',
        icon: 'fa-gears',
        links: [
          {
            name: 'COMMON.TAB.FUNCTIONALITIES',
            href: '#parameters/functionalities'
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            href: '#parameters/mime_policy'
          }
        ]
      };
      this.users = {
        name: 'COMMON.TAB.USERS',
        icon: 'fa-users',
        links: [
          {
            name: 'COMMON.TAB.MANAGE_USERS',
            href: '#users/management'
          }
        ]
      };
      this.inconsistent = {
        name: 'COMMON.TAB.INCONSISTENT_USERS',
        href: '#users/inconsistent'
      };
      this.threads = {
        name: 'COMMON.TAB.THREADS',
        href: '#users/threads'
      };
      this.mailingLists = {
        name: 'COMMON.TAB.MAILING_LISTS',
        href: '#users/mailing_lists'
      };
      this.audit = {
        name: 'COMMON.TAB.HISTORY',
        icon: 'fa-archive',
        links: [
          {
            name: 'COMMON.TAB.AUDIT',
            href: '#history/audit'
          }
        ]
      };

      var self = this;

      // Public API here
      return {
        getAvailableTabs: function(user) {
          $log.debug('Tab:getAvailableTabs');
          var tabs = [];

          tabs.push(self.parameters);
          tabs.push(self.users);
          tabs.push(self.audit);
          if (Authentication.isSuperAdmin(user)) {
            tabs.push(self.domains);
            tabs.push(self.mails);
            self.users.links.push(self.threads);
            self.users.links.push(self.inconsistent);
            self.users.links.push(self.mailingLists);
          }
          return tabs;
        }
      };
    }
  ]
);
