'use strict';

angular.module('linshareAdminApp')
  .factory('Tab',
    ['_', '$log', 'Authentication', 'lsAppConfig',
    function(_, $log, Authentication, lsAppConfig) {
      var domains = {
        name: 'COMMON.TAB.DOMAINS',
        icon: 'fa-cloud',
        superAdminOnly: true,
        links: [
          {
            name: 'COMMON.TAB.LDAP_CONNECTIONS',
            sref: 'ldapconnection.list',
            childrenSref: [
              'ldapconnection.detail'
            ]
          }, {
            name: 'COMMON.TAB.DOMAIN_PATTERNS',
            sref: 'domainpattern.list',
            childrenSref: [
              'domainpattern.detail'
            ]
          }, {
            name: 'COMMON.TAB.MANAGE_DOMAINS',
            sref: 'domain.detail'
          }, {
            name: 'COMMON.TAB.DOMAIN_ORDER',
            sref: 'domainorder.order'
          }, {
            name: 'COMMON.TAB.DOMAIN_POLICIES',
            sref: 'domainpolicy.list',
            childrenSref: [
              'domainpolicy.detail'
            ]
          }, {
            name: 'COMMON.TAB.MANAGE_QUOTA',
            sref: 'quota.detail'
          }, {
            name: 'COMMON.TAB.UPGRADES_TASKS',
            sref: 'upgradetasks.list'
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
            childrenSref: [
              'maillayout.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_FOOTER',
            sref: 'mailfooter.list',
            childrenSref: [
              'mailfooter.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_CONTENT',
            sref: 'mailcontent.list',
            childrenSref: [
              'mailcontent.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_CONFIG',
            sref: 'mailconfig.list',
            childrenSref: [
              'mailconfig.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAIL_ACTIVATION',
            superAdminOnly: false,
            sref: 'mailactivation.list',
            childrenSref: [
              'mailactivation.detail'
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
            childrenSref: [
              'functionality.detail'
            ]
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            superAdminOnly: true,
            sref: 'mimepolicy.list',
            childrenSref: [
              'mimepolicy.detail'
            ]
          },/* {
            name: 'COMMON.TAB.UPLOAD_PROPOSITION_FILTER',
            superAdminOnly: true,
            sref: 'uploadpropositionfilter.list',
            childrenSref: [
              'uploadpropositionfilter.detail',
            ]
          },*/ {
            name: 'COMMON.TAB.WELCOME_MESSAGES',
            superAdminOnly: false,
            sref: 'welcomemessage.list',
            childrenSref: [
              'welcomemessage.detail',
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
            childrenSref: [
              'user.detail'
            ]
          }, {
            name: 'COMMON.TAB.INCONSISTENT_USERS',
            superAdminOnly: true,
            sref: 'inconsistentuser.search',
            childrenSref: [
              'inconsistentuser.search.detail',
              'inconsistentuser.list.all',
              'inconsistentuser.list.detail'
            ]
          }, {
            name: 'COMMON.TAB.THREADS',
            superAdminOnly: true,
            sref: 'thread.list',
            childrenSref: [
              'thread.detail'
            ]
          }, {
            name: 'COMMON.TAB.MAILING_LISTS',
            superAdminOnly: true,
            sref: 'mailinglist.list',
            childrenSref: [
              'mailinglist.detail'
            ]
          }, {
            name: 'COMMON.TAB.TECHNICAL_ACCOUNT',
            superAdminOnly: true,
            sref: 'technicalaccount.list',
            childrenSref: [
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
            superAdminOnly: true,
            sref: 'auditv2'
          }/*, {
            name: 'COMMON.TAB.UPLOAD_REQUEST',
            superAdminOnly: true,
            sref: 'uploadrequest.form'
          }*/
        ]
      };

      if(!lsAppConfig.auditV1hidden) {
        history.links.unshift({
          name: 'COMMON.TAB.AUDIT_V1',
          superAdminOnly: false,
          sref: 'audit.form'
        });
      }

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
