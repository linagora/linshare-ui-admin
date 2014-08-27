'use strict';

angular.module('linshareAdminApp')
  .factory('Tab',
    ['$log', 'Authentication',
    function($log, Authentication) {
      var domains = {
        name: 'COMMON.TAB.DOMAINS',
        icon: 'fa-cloud',
        superAdminOnly: true,
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
     
      var mails = { 
        name: 'COMMON.TAB.MAILS',
        icon: 'fa-envelope',
        superAdminOnly: true,
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

      var parameters = {
        name: 'COMMON.TAB.PARAMETERS',
        icon: 'fa-gears',
        superAdminOnly: false,
        links: [
          {
            name: 'COMMON.TAB.FUNCTIONALITIES',
            superAdminOnly: false,
            href: '#parameters/functionalities'
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            superAdminOnly: false,
            href: '#parameters/mime_policy'
          }, {
            name: 'COMMON.TAB.UPLOAD_PROPOSITION_FILTER',
            superAdminOnly: false,
            href: '#parameters/upload_proposition_filter'
          }
        ]
      };

      var users = {
        name: 'COMMON.TAB.USERS',
        icon: 'fa-users',
        superAdminOnly: false,
        links: [
          {
            name: 'COMMON.TAB.MANAGE_USERS',
            superAdminOnly: false,
            href: '#users/management'
          }, {
            name: 'COMMON.TAB.INCONSISTENT_USERS',
            superAdminOnly: true,
            href: '#users/inconsistent'
          }, {
            name: 'COMMON.TAB.THREADS',
            superAdminOnly: true,
            href: '#users/threads'
          }, {
            name: 'COMMON.TAB.MAILING_LISTS',
            superAdminOnly: true,
            href: '#users/mailing_lists'
          }, {
            name: 'COMMON.TAB.TECHNICAL_ACCOUNT',
            superAdminOnly: true,
            href: '#users/technical_account'
          }
        ]
      };

      var history = {
        name: 'COMMON.TAB.HISTORY',
        icon: 'fa-archive',
        superAdminOnly: false,
        links: [
          {
            name: 'COMMON.TAB.AUDIT',
            superAdminOnly: false,
            href: '#history/audit'
          }, {
            name: 'COMMON.TAB.UPLOAD_REQUEST',
            superAdminOnly: false,
            href: '#history/upload_request'
          }
        ]
      };

      this.tabs = [parameters, users, history, domains, mails];

      var self = this;

      // Public API here
      return {
        getAvailableTabs: function(user) {
          $log.debug('Tab:getAvailableTabs');
          var tabs = self.tabs;
          if (!Authentication.isSuperAdmin(user)) {
            tabs = _.filter(tabs, function(container) {
              return container.superAdminOnly === false;
            });
            
            _.forEach(tabs, function(container) {
              container.links = _.filter(container.links, function(link) {
                return link.superAdminOnly === false;
              });
            });
          }
          return tabs;
        }
      };
    }
  ]
);
