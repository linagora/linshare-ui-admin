'use strict';

angular.module('linshareAdminApp')
  .factory('Tab',
    ['_', '$log', 'Authentication', 'lsAppConfig',
    function(_, $log, Authentication, lsAppConfig) {
      var domains = {
        name: 'COMMON.TAB.DOMAINS',
        icon: 'fa-cloud',
        superAdminOnly: false,
        links: [
          {
            name: 'COMMON.TAB.MANAGE_DOMAINS',
            sref: 'domain.detail',
            superAdminOnly: true
          }, {
              name: 'COMMON.TAB.DOMAIN_POLICIES',
              sref: 'domainpolicy.list',
              superAdminOnly: true,
              childrenSref: [
                'domainpolicy.detail'
              ]
          }, {
            name: 'COMMON.TAB.FUNCTIONALITIES',
            superAdminOnly: false,
            sref: 'functionality.list',
            childrenSref: [
              'functionality.detail'
            ]
          }, {
            name: 'COMMON.TAB.LDAP_CONNECTIONS',
            sref: 'ldapconnection.list',
            superAdminOnly: true,
            hiddenOnLegacy: true,
            childrenSref: [
              'ldapconnection.detail'
            ]
          }, {
            name: 'COMMON.TAB.DOMAIN_PATTERNS',
            sref: 'domainpattern.list',
            superAdminOnly: true,
            hiddenOnLegacy: true,
            childrenSref: [
              'domainpattern.detail'
            ]
          }, {
            name: 'COMMON.TAB.GROUP_PATTERNS',
            sref: 'grouppattern.list',
            superAdminOnly: true,
            hiddenOnLegacy: true,
            childrenSref: [
              'grouppattern.detail'
            ]
          }, {
            name: 'COMMON.TAB.MIME_POLICIES',
            superAdminOnly: false,
            sref: 'mimepolicy.list',
            childrenSref: [
              'mimepolicy.detail'
            ]
          }, {
            name: 'COMMON.TAB.WELCOME_MESSAGES',
            superAdminOnly: false,
            sref: 'welcomemessage.list',
            childrenSref: [
              'welcomemessage.detail',
            ]
          }, {
            name: 'COMMON.TAB.MANAGE_QUOTA',
            sref: 'quota.detail'
          }
        ]
      };

      var mails = {
        name: 'COMMON.TAB.MAILS',
        icon: 'fa-envelope',
        superAdminOnly: true,
        links: [
          {
            name: 'COMMON.TAB.MAIL_CONFIG',
            sref: 'mailconfig.list',
            childrenSref: [
              'mailconfig.detail'
            ]
          }, {
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
            name: 'COMMON.TAB.MAIL_ACTIVATION',
            sref: 'mailactivation.list',
            childrenSref: [
              'mailactivation.detail'
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
            superAdminOnly: false,
            sref: 'auditv2'
          }
        ]
      };

      if(!lsAppConfig.auditV1hidden) {
        history.links.push({
          name: 'COMMON.TAB.AUDIT_V1',
          superAdminOnly: false,
          sref: 'audit.form'
        });
      }

      var upgradeTasks = {
        name: 'COMMON.TAB.UPGRADES_TASKS',
        icon: 'fa-arrow-up',
        superAdminOnly: true,
        links: [
          {
            name: 'COMMON.TAB.UPGRADES_TASKS',
            sref: 'upgradetasks.list'
          }
        ]
      };

      var workgroups = {
        name: 'COMMON.TAB.THREADS',
        icon: 'fa-folder-open',
        superAdminOnly: true,
        hiddenOnLegacy: true,
        childrenSref: [
          'thread.detail'
        ],
        links: [
          {
            name: 'COMMON.TAB.THREADS',
            sref: 'thread.list',
          }
        ]
      };

      var contactsList = {
        name: 'COMMON.TAB.MAILING_LISTS',
        icon: 'fa-list-ul',
        superAdminOnly: true,
        childrenSref: [
          'mailinglist.detail'
        ],
        links: [
          {
            name: 'COMMON.TAB.MAILING_LISTS',
            sref: 'mailinglist.list',
          }
        ]
      };

      this.tabs = [domains, users, workgroups, contactsList, history, mails, upgradeTasks];

      var self = this;

      // Public API here
      return {
        getAvailableTabs: function(user) {
          $log.debug('Tab:getAvailableTabs');
          var tabs = self.tabs;

          tabs = _.filter(tabs, filterFnc);

          _.forEach(tabs, function(tab) {
            tab.links = _.filter(tab.links, filterFnc);
          });

          function filterFnc(entry) {
            if (!Authentication.isSuperAdmin(user) && entry.superAdminOnly) {
              return false;
            }

            if (lsAppConfig.legacyMode.enabled && entry.hiddenOnLegacy) {
              return false;
            }

            return true;
          }

          return tabs;
        }
      };
    }
  ]
);
