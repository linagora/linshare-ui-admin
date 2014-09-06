'use strict';

angular.module('linshareAdminApp').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    //  For any unmatched url, redirect
    $urlRouterProvider.otherwise('/user/list');

    var funcAccountExpiration = function(currentUser, Functionality) {
      if (currentUser) {
        return Functionality.get(currentUser.domain , 'ACCOUNT_EXPIRATION');
      }
    };
    var funcRestrictedGuest = function(currentUser, Functionality) {
      if (currentUser) {
        return Functionality.get(currentUser.domain , 'RESTRICTED_GUEST');
      }
    };

    var enumRole = function(Enum) {
      return Enum.getOptions('role');
    };
    var enumLanguage = function(Enum) {
      return Enum.getOptions('language');
    };
    var enumLogAction = function(Enum) {
      return Enum.getOptions('log_action');
    };
    var enumDomainAccessRuleTypes = function(Enum) {
      return Enum.getOptions('domain_access_rule_type');
    };
    var enumUploadPropositionFieldTypes = function(Enum) {
      return Enum.getOptions('upload_proposition_rule_field_type');
    };
    var enumUploadPropositionOperatorTypes = function(Enum) {
      return Enum.getOptions('upload_proposition_rule_operator_type');
    };
    var enumUploadPropositionActionTypes = function(Enum) {
      return Enum.getOptions('upload_proposition_action_type');
    };
    var enumUploadPropositionMatchTypes = function(Enum) {
      return Enum.getOptions('upload_proposition_match_type');
    };
    var enumTechnicalAccountPermissionTypes = function(Enum) {
      return Enum.getOptions('technical_account_permission_type');
    };
    var enumUploadRequestStatus = function(Enum) {
      return Enum.getOptions('upload_request_status');
    };

    var authenticatedUser = function(Authentication) {
      return Authentication.getCurrentUser();
    };

    // Common views
    var domainTreeView = {
      templateUrl: 'ng_components/domain/domain_tree.tpl.html',
      controller: 'DomainTreeCtrl',
      resolve: {
        rootDomain: function(Domain, authenticatedUser) {
          return Domain.getDomainTree(authenticatedUser.domain);
        },
      }
    };

    $stateProvider
      .state('functionality', {
        abstract: true,
        url: '/functionality',
        templateUrl: 'ng_components/functionality/functionality.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('functionality.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/functionality/functionality_list.tpl.html',
            controller: 'FunctionalityListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              functionalities: function(Functionality, currentDomain) {
                return Functionality.getAll(currentDomain.identifier);
              }
            }
          },
        },
      })
      .state('functionality.detail', {
        url: '/:domainId/detail/:id',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/functionality/functionality_detail.tpl.html',
            controller: 'FunctionalityDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentFunctionality: function(Functionality, $stateParams) {
                return Functionality.getAll($stateParams.domainId).then(function(functionalities) {
                  return _.find(functionalities, {identifier: $stateParams.id});
                });
              }
            }
          },
        },
      })
    
      .state('mimepolicy', {
        abstract: true,
        url: '/mimepolicy',
        templateUrl: 'ng_components/mimepolicy/mimepolicy.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('mimepolicy.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mimepolicy/mimepolicy_list.tpl.html',
            controller: 'MimePolicyListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              mimePolicies: function(MimePolicy, currentDomain) {
                return MimePolicy.getAll(currentDomain.identifier, true);
              }
            }
          },
        },
      })
      .state('mimepolicy.detail', {
        url: '/:domainId/detail/:id',
        views: {
          'detail': {
            templateUrl: 'ng_components/mimepolicy/mimepolicy_detail.tpl.html',
            controller: 'MimePolicyDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentMimePolicy: function($stateParams, MimePolicy) {
                 return MimePolicy.get($stateParams.id, true);
              }
            }
          }
        }
      })
    
      .state('user', {
        abstract: true,
        url: '/user',
        templateUrl: 'ng_components/user/user.html'
      })
      .state('user.list', {
        url: '/list',
        templateUrl: 'ng_components/user/user_list.tpl.html',
        controller: 'UserListCtrl',
      })
      .state('user.detail', {
        url: '/:uuid',
        resolve: {
          currentUser: function(User, $stateParams) {
            return User.get($stateParams.uuid);
          },
          maxExpiryDate: function(_funcAccountExpiration) {
            var date = new Date();
            var delta = _funcAccountExpiration.parameters[0].integer;
            if (_funcAccountExpiration.parameters.string === 'DAY') {
              date.setDay(date.getDay() + delta);
            } else if (_funcAccountExpiration.parameters.string === 'WEEK') {
              date.setWeek(date.getWeek() + delta);
            } else {
              date.setMonth(date.getMonth() + delta);
            }
            return date;
          },
          restrictedGuestStatus: function(_funcRestrictedGuest) {
            return _funcRestrictedGuest.activationPolicy.policy !== 'ALLOWED';
          },
          selectOptions: function(_enumRole) {
            return {
              userRoles: _.remove(_enumRole, function(role) {
                return role !== 'SYSTEM' && role !== 'SUPERADMIN';
              }),
            };
          },
          _funcAccountExpiration: funcAccountExpiration,
          _funcRestrictedGuest: funcRestrictedGuest,
          _enumRole: enumRole,
        },
        templateUrl: 'ng_components/user/user_detail.tpl.html',
        controller: 'UserDetailCtrl',
      })

      .state('inconsistentuser', {
        abstract: true,
        url: '/inconsistentuser',
        templateUrl: 'ng_components/inconsistentuser/inconsistentuser.html',
        resolve: {
          allInconsistents: function(User) {
            return User.getAllInconsistent();
          }
        }
      })
      .state('inconsistentuser.list', {
        url: '/list',
        templateUrl: 'ng_components/inconsistentuser/inconsistentuser_list.tpl.html',
        controller: 'InconsistentUserListCtrl',
      })
      .state('inconsistentuser.detail', {
        url: '/:uuid',
        resolve: {
          currentUser: function(allInconsistents, $stateParams) {
            return _.find(allInconsistents, {uuid: $stateParams.uuid});
          },
          allDomains: function(Domain) {
            return Domain.getAll();
          },
        },
        templateUrl: 'ng_components/inconsistentuser/inconsistentuser_detail.tpl.html',
        controller: 'InconsistentUserDetailCtrl',
      })

      .state('thread', {
        abstract: true,
        url: '/group',
        templateUrl: 'ng_components/thread/thread.html'
      })
      .state('thread.list', {
        url: '/list',
        templateUrl: 'ng_components/thread/thread_list.tpl.html',
        controller: 'ThreadListCtrl',
        resolve: {
          threads: function(Thread) {
            return Thread.getAll();
          },
        }
      })
      .state('thread.detail', {
        url: '/:id',
        templateUrl: 'ng_components/thread/thread_detail.tpl.html',
        controller: 'ThreadDetailCtrl',
        resolve: {
          currentThread: function($stateParams, Thread) {
            if ($stateParams.id) {
              return Thread.get($stateParams.id);
            }
          }
        }
      })
    
      .state('mailinglist', {
        abstract: true,
        url: '/mailinglist',
        templateUrl: 'ng_components/mailinglist/mailinglist.html'
      })
      .state('mailinglist.list', {
        url: '/list',
        templateUrl: 'ng_components/mailinglist/mailinglist_list.tpl.html',
        controller: 'MailingListListCtrl',
        resolve: {
          mailingLists: function(MailingList) {
            return MailingList.getAll();
          },
        }
      })
      .state('mailinglist.detail', {
        url: '/:id',
        templateUrl: 'ng_components/mailinglist/mailinglist_detail.tpl.html',
        controller: 'MailingListDetailCtrl',
        resolve: {
          currentMailingList: function($stateParams, MailingList) {
            if ($stateParams.id) {
              return MailingList.get($stateParams.id);
            }
          }
        }
      })

      .state('audit', {
        abstract: true,
        templateUrl: 'ng_components/audit/audit.html',
      })
      .state('audit.form', {
        url: '/audit',
        views: {
          'form': {
            templateUrl: 'ng_components/audit/audit_form.tpl.html',
            controller: 'AuditFormCtrl',
            resolve: {
              selectOptions: function(_allDomains, _enumLogAction) {
                return {
                  domains: _allDomains,
                  actions: _enumLogAction,
                };
              },
              authenticatedUser: authenticatedUser,
              _allDomains: function(Domain) {
                return Domain.getAll();
              },
              _enumLogAction: enumLogAction,
            }
          }
        }
      })

      .state('ldapconnection', {
        abstract: true,
        url: '/ldapconnection',
        templateUrl: 'ng_components/ldapconnection/ldapconnection.html'
      })
      .state('ldapconnection.list', {
        url: '/list',
        templateUrl: 'ng_components/ldapconnection/ldapconnection_list.tpl.html',
        controller: 'LdapConnectionListCtrl',
        resolve: {
          ldapConnections: function(LdapConnection) {
            return LdapConnection.getAll();
          },
        }
      })
      .state('ldapconnection.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/ldapconnection/ldapconnection_detail.tpl.html',
        controller: 'LdapConnectionDetailCtrl',
        resolve: {
          currentLdapConnection: function($stateParams, LdapConnection) {
            if ($stateParams.id) {
              return LdapConnection.get($stateParams.id);
            }
          }
        }
      })
    
      .state('domainpattern', {
        abstract: true,
        url: '/domainpattern',
        templateUrl: 'ng_components/domainpattern/domainpattern.html'
      })
      .state('domainpattern.list', {
        url: '/list',
        templateUrl: 'ng_components/domainpattern/domainpattern_list.tpl.html',
        controller: 'DomainPatternListCtrl',
        resolve: {
          domainPatterns: function(DomainPattern) {
            return DomainPattern.getAll();
          },
        }
      })
      .state('domainpattern.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/domainpattern/domainpattern_detail.tpl.html',
        controller: 'DomainPatternDetailCtrl',
        resolve: {
          currentDomainPattern: function($stateParams, DomainPattern) {
            if ($stateParams.id) {
              return DomainPattern.get($stateParams.id);
            }
          },
          models: function(DomainPattern) {
            return DomainPattern.getAllModels();
          }
        }
      })

      .state('domain', {
        url: '/domain',
        abstract: true,
        templateUrl: 'ng_components/domain/domain.html',
        resolve: {
          treeType: function() {
            return 'edit';
          }
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('domain.detail', {
        url: '/detail/:domainId?formState&domainType',
        resolve: {
          authenticatedUser: authenticatedUser,
        },
        views : {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/domain/domain_detail.tpl.html',
            controller: 'DomainDetailCtrl',
            resolve: {
              selectOptions: function(_allLdapConnections, _allDomainPatterns, _allDomainPolicies, _allMailConfigs, _allMimePolicies,  _enumRole, _enumLanguage) {
                return {
                  ldapConnectionIds: _.pluck(_allLdapConnections, 'identifier'),
                  domainPatternIds: _.pluck(_allDomainPatterns, 'identifier'),
                  domainPolicyIds: _.pluck(_allDomainPolicies, 'identifier'),
                  mailConfigs: _allMailConfigs,
                  mimePolicies: _allMimePolicies,
                  userRoles: _.remove(_enumRole, function(role) {
                    return role !== 'SYSTEM' && role !== 'SUPERADMIN';
                  }),
                  languages: _enumLanguage,
                };
              },
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId);
                }
              },
              _allLdapConnections: function(LdapConnection) {
                return LdapConnection.getAll();
              },
              _allDomainPatterns: function(DomainPattern) {
                return DomainPattern.getAll();
              },
              _allDomainPolicies: function(DomainPolicy) {
                return DomainPolicy.getAll();
              },
              _allMailConfigs: function(currentDomain, MailConfig) {
                if (currentDomain) {
                  return MailConfig.getAll(currentDomain.identifier, false);
                }
              },
              _allMimePolicies: function(currentDomain, MimePolicy) {
                if (currentDomain) {
                  return MimePolicy.getAll(currentDomain.identifier, false);
                }
              },
              _enumRole: enumRole,
              _enumLanguage: enumLanguage,
            }
          }
        },
      })
     .state('domain.order', {
       url: '/order',
       templateUrl: 'ng_components/domain/domain_order.tpl.html',
       controller: 'DomainOrderCtrl',
       resolve: {
         domains: function(Domain) {
           return Domain.getAll();
         },
       }
     })
    
      .state('domainpolicy', {
        abstract: true,
        url: '/domainpolicy',
        templateUrl: 'ng_components/domainpolicy/domainpolicy.html'
      })
      .state('domainpolicy.list', {
        url: '/list',
        templateUrl: 'ng_components/domainpolicy/domainpolicy_list.tpl.html',
        controller: 'DomainPolicyListCtrl',
        resolve: {
          domainPolicies: function(DomainPolicy) {
            return DomainPolicy.getAll();
          },
        }
      })
      .state('domainpolicy.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/domainpolicy/domainpolicy_detail.tpl.html',
        controller: 'DomainPolicyDetailCtrl',
        resolve: {
          selectOptions: function(_allDomains, _enumDomainAccessRuleTypes) {
            return {
              domains: _allDomains,
              domainAccessRuleTypes: _enumDomainAccessRuleTypes,
            };
          },
          currentDomainPolicy: function($stateParams, DomainPolicy) {
            if ($stateParams.id) {
              return DomainPolicy.get($stateParams.id);
            }
          },
          _allDomains: function(Domain) {
            return Domain.getAll();
          },
          _enumDomainAccessRuleTypes: enumDomainAccessRuleTypes,
        }
      })

      .state('maillayout', {
        abstract: true,
        url: '/maillayout',
        templateUrl: 'ng_components/maillayout/maillayout.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
          defaultDomain: function(authenticatedUser) {
            return authenticatedUser.domain;
          }
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('maillayout.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/maillayout/maillayout_list.tpl.html',
            controller: 'MailLayoutListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams, $state, defaultDomain) {
                var domainId = $stateParams.domainId || defaultDomain;
                return Domain.get(domainId);
              },
              mailLayouts: function(MailLayout, currentDomain) {
                return MailLayout.getAll(currentDomain.identifier, true);
              }
            }
          },
        },
      })
      .state('maillayout.detail', {
        url: '/:domainId/detail/:id',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/maillayout/maillayout_detail.tpl.html',
            controller: 'MailLayoutDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentMailLayout: function(MailLayout, $stateParams) {
                return MailLayout.get($stateParams.domainId, $stateParams.id);
              }
            }
          },
        },
      })

      .state('mailcontent', {
        abstract: true,
        url: '/mailcontent',
        templateUrl: 'ng_components/mailcontent/mailcontent.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('mailcontent.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailcontent/mailcontent_list.tpl.html',
            controller: 'MailContentListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              mailContents: function(MailContent, currentDomain) {
                return MailContent.getAll(currentDomain.identifier, true);
              }
            }
          },
        },
      })
      .state('mailcontent.detail', {
        url: '/:domainId/detail/:id',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/mailcontent/mailcontent_detail.tpl.html',
            controller: 'MailContentDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentMailContent: function(MailContent, $stateParams) {
                return MailContent.get($stateParams.domainId, $stateParams.id);
              }
            }
          },
        },
      })

      .state('mailfooter', {
        abstract: true,
        url: '/mailfooter',
        templateUrl: 'ng_components/mailfooter/mailfooter.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('mailfooter.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailfooter/mailfooter_list.tpl.html',
            controller: 'MailFooterListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              mailFooters: function(MailFooter, currentDomain) {
                return MailFooter.getAll(currentDomain.identifier, true);
              }
            }
          },
        },
      })
      .state('mailfooter.detail', {
        url: '/:domainId/detail/:id',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/mailfooter/mailfooter_detail.tpl.html',
            controller: 'MailFooterDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentMailFooter: function(MailFooter, $stateParams) {
                return MailFooter.get($stateParams.domainId, $stateParams.id);
              }
            }
          },
        },
      })

      .state('mailconfig', {
        abstract: true,
        url: '/mailconfig',
        templateUrl: 'ng_components/mailconfig/mailconfig.html',
        resolve: {
          treeType: function() {
            return 'read';
          },
          authenticatedUser: authenticatedUser,
        },
        controller: function($scope, $state) {
          $scope.$state = $state;
        }
      })
      .state('mailconfig.list', {
        url: '/:domainId/list',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailconfig/mailconfig_list.tpl.html',
            controller: 'MailConfigListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              mailConfigs: function(MailConfig, currentDomain) {
                return MailConfig.getAll(currentDomain.identifier, true);
              }
            }
          },
        },
      })
      .state('mailconfig.detail', {
        url: '/:domainId/detail/:id?language&mailContentLangId',
        views: {
          'detail': {
            templateUrl: 'ng_components/mailconfig/mailconfig_detail.tpl.html',
            controller: 'MailConfigDetailCtrl',
            resolve: {
              mailLayouts: function(MailLayout, $stateParams) {
                return MailLayout.getAll($stateParams.domainId, false);
              },
              mailFooterLangs: function(MailConfig, $stateParams) {
                return MailConfig.getAllMailFooters($stateParams.id, $stateParams.language);
              },
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId);
              },
              currentMailConfig: function(MailConfig, $stateParams) {
                return MailConfig.get($stateParams.domainId, $stateParams.id);
              }
            }
          },
          'mailcontentlang': {
            templateUrl: 'ng_components/mailcontent/mailcontentlang_detail.tpl.html',
            controller: 'MailContentLangDetailCtrl',
            resolve: {
              currentMailContentLang: function(MailContentLang, $stateParams) {
                if ($stateParams.mailContentLangId) {
                  return MailContentLang.get($stateParams.mailContentLangId);
                }
              },
              mailContents: function(MailConfig, currentMailContentLang, $stateParams) {
                if (currentMailContentLang) {
                  return MailConfig.getAllMailContents($stateParams.id, currentMailContentLang.language, currentMailContentLang.mailContentType);
                }
              },
            }
          }
        },
      })

      .state('password', {
        url: '/password',
        templateUrl: 'ng_components/password/password.html',
        controller: 'PasswordCtrl'
      })

      .state('uploadpropositionfilter', {
        abstract: true,
        url: '/uploadpropositionfilter',
        templateUrl: 'ng_components/uploadpropositionfilter/uploadpropositionfilter.html'
      })
      .state('uploadpropositionfilter.list', {
        url: '/list',
        templateUrl: 'ng_components/uploadpropositionfilter/uploadpropositionfilter_list.tpl.html',
        controller: 'UploadPropositionFilterListCtrl',
        resolve: {
          uploadPropositionFilters: function(UploadPropositionFilter) {
            return UploadPropositionFilter.getAll();
          }
        }
      })
      .state('uploadpropositionfilter.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/uploadpropositionfilter/uploadpropositionfilter_detail.tpl.html',
        controller: 'UploadPropositionFilterDetailCtrl',
        resolve: {
          currentUploadPropositionFilter: function($stateParams, UploadPropositionFilter) {
            if ($stateParams.id) {
              return UploadPropositionFilter.get($stateParams.id);
            }
          },
          selectOptions: function(_enumUploadPropositionFieldTypes, _enumUploadPropositionOperatorTypes, _enumUploadPropositionActionTypes, _enumUploadPropositionMatchTypes) {
            return {
              fieldTypes: _enumUploadPropositionFieldTypes,
              operatorTypes: _enumUploadPropositionOperatorTypes,
              actionTypes: _enumUploadPropositionActionTypes,
              matchTypes: _enumUploadPropositionMatchTypes
            };
          },
          _enumUploadPropositionFieldTypes: enumUploadPropositionFieldTypes,
          _enumUploadPropositionOperatorTypes: enumUploadPropositionOperatorTypes,
          _enumUploadPropositionActionTypes: enumUploadPropositionActionTypes,
          _enumUploadPropositionMatchTypes: enumUploadPropositionMatchTypes
        }
      })

      .state('technicalaccount', {
        abstract: true,
        url: '/technicalaccount',
        templateUrl: 'ng_components/technicalaccount/technicalaccount.html'
      })
      .state('technicalaccount.list', {
        url: '/list',
        templateUrl: 'ng_components/technicalaccount/technicalaccount_list.tpl.html',
        controller: 'TechnicalAccountListCtrl',
        resolve: {
          technicalAccounts: function(TechnicalAccount) {
            return TechnicalAccount.getAll();
          }
        }
      })
      .state('technicalaccount.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/technicalaccount/technicalaccount_detail.tpl.html',
        controller: 'TechnicalAccountDetailCtrl',
        resolve: {
          currentTechnicalAccount: function($stateParams, TechnicalAccount) {
            if ($stateParams.id) {
              return TechnicalAccount.get($stateParams.id);
            }
          },
          selectOptions: function(_enumTechnicalAccountPermissionTypes) {
            return {
              permissionTypes: _enumTechnicalAccountPermissionTypes,
            };
          },
          _enumTechnicalAccountPermissionTypes: enumTechnicalAccountPermissionTypes,
        }
      })

      .state('uploadrequest', {
        url: '/uploadrequest',
        abstract: true,
        templateUrl: 'ng_components/uploadrequest/uploadrequest.html',
      })
      .state('uploadrequest.form', {
        url: '/form',
        templateUrl: 'ng_components/uploadrequest/uploadrequest_form.tpl.html',
        controller: 'UploadRequestFormCtrl',
        resolve: {
          uploadRequestStatus: enumUploadRequestStatus,
        }
      })

      ;
  }
]);
