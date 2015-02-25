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
            sref: 'ldapconnection.list',
            children_sref: [
              'ldapconnection.detail'
            ]
          }, {
            name: 'COMMON.TAB.DOMAIN_PATTERNS',
            sref: 'domainpattern.list',
            children_sref: [
              'domainpattern.detail'
            ]
          }, {
            name: 'COMMON.TAB.MANAGE_DOMAINS',
            sref: 'domain.detail'
          }, {
            name: 'COMMON.TAB.DOMAIN_ORDER',
            sref: 'domain.order'
          }, {
            name: 'COMMON.TAB.DOMAIN_POLICIES',
            sref: 'domainpolicy.list',
            children_sref: [
              'domainpolicy.detail'
            ]
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
            sref: 'maillayout.list',
            children_sref: [
              'maillayout.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_FOOTER',
            sref: 'mailfooter.list',
            children_sref: [
              'mailfooter.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_CONTENT',
            sref: 'mailcontent.list',
            children_sref: [
              'mailcontent.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_CONFIG',
            sref: 'mailconfig.list',
            children_sref: [
              'mailconfig.detail'
            ]
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
            sref: 'functionality.list',
            children_sref: [
              'functionality.detail'
            ]
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            superAdminOnly: true,
            sref: 'mimepolicy.list',
            children_sref: [
              'mimepolicy.detail'
            ]
          }, {
            name: 'COMMON.TAB.UPLOAD_PROPOSITION_FILTER',
            superAdminOnly: true,
            sref: 'uploadpropositionfilter.list',
            children_sref: [
              'uploadpropositionfilter.detail',
            ]
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
            sref: 'user.list',
            children_sref: [
              'user.detail'
            ]
          }, {
            name: 'COMMON.TAB.INCONSISTENT_USERS',
            superAdminOnly: true,
            sref: 'inconsistentuser.list',
            children_sref: [
              'inconsistentuser.detail'
            ]
          }, {
            name: 'COMMON.TAB.THREADS',
            superAdminOnly: true,
            sref: 'thread.list',
            children_sref: [
              'thread.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAILING_LISTS',
            superAdminOnly: true,
            sref: 'mailinglist.list',
            children_sref: [
              'mailinglist.detail'
            ]
          }, {
            name: 'COMMON.TAB.TECHNICAL_ACCOUNT',
            superAdminOnly: true,
            sref: 'technicalaccount.list',
            children_sref: [
              'technicalaccount.detail'
            ]
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
            sref: 'audit.form'
          }, {
            name: 'COMMON.TAB.UPLOAD_REQUEST',
            superAdminOnly: true,
            sref: 'uploadrequest.form'
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
