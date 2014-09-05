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
            href: '#ldapconnection/list'
          }, {
            name: 'COMMON.TAB.DOMAIN_PATTERNS',
            href: '#domainpattern/list'
          }, {
            name: 'COMMON.TAB.MANAGE_DOMAINS',
            href: '#domain/detail/'
          }, {
            name: 'COMMON.TAB.DOMAIN_ORDER',
            href: '#domain/order'
          }, {
            name: 'COMMON.TAB.DOMAIN_POLICIES',
            href: '#domainpolicy/list'
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
            href: '#maillayout/list'
          }, {
            name: 'COMMON.TAB.MAIL_FOOTER',
            href: '#mailfooter/list'
          }, {
            name: 'COMMON.TAB.MAIL_CONTENT',
            href: '#mailcontent/list'
          }, {
            name: 'COMMON.TAB.MAIL_CONFIG',
            href: '#mailcondig/list'
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
            href: '#functionality/list'
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            superAdminOnly: false,
            href: '#mimepolicy/list'
          }, {
            name: 'COMMON.TAB.UPLOAD_PROPOSITION_FILTER',
            superAdminOnly: false,
            href: '#uploadpropositionfilter/list'
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
            href: '#user/list'
          }, {
            name: 'COMMON.TAB.INCONSISTENT_USERS',
            superAdminOnly: true,
            href: '#inconsistentuser/list'
          }, {
            name: 'COMMON.TAB.THREADS',
            superAdminOnly: true,
            href: '#group/list'
          }, {
            name: 'COMMON.TAB.MAILING_LISTS',
            superAdminOnly: true,
            href: '#mailinglist/list'
          }, {
            name: 'COMMON.TAB.TECHNICAL_ACCOUNT',
            superAdminOnly: true,
            href: '#technicalaccount/list'
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
            href: '#audit'
          }, {
            name: 'COMMON.TAB.UPLOAD_REQUEST',
            superAdminOnly: false,
            href: '#uploadrequest/list'
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
