'use strict';

angular.module('linshareAdminApp').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    //  For any unmatched url, redirect
    //$urlRouterProvider.otherwise('/user/list');
    var allLdapConnections = function(LdapConnection) {
      return LdapConnection.getAll(function (ldapConnections) {
        return ldapConnections;
      });
    };
    var allDomainPatterns = function(DomainPattern) {
      return DomainPattern.getAll(function (domainPatterns) {
        return domainPatterns;
      });
    };
    var allDomainPolicies = function(DomainPolicy) {
      return DomainPolicy.getAll(function (domainPolicies) {
        return domainPolicies;
      });
    };
    var allDomains = function(Domain) {
      return Domain.getAll(function(domains) {
        return domains;
      });
    };
    var allThreads = function(Thread) {
      return Thread.getAll(function(threads) {
        return threads;
      });
    };
    var allMailingLists = function(MailingList) {
      return MailingList.getAll(function(mailingLists) {
        return mailingLists;
      });
    };
    var allMailConfigs = function(currentDomain, MailConfig) {
      if (currentDomain) {
        return MailConfig.getAll(currentDomain.identifier, false, function(mailConfigs) {
          return mailConfigs;
        });
      }
    };
    var allMimePolicies = function(currentDomain, MimePolicy) {
      if (currentDomain) {
        return MimePolicy.getAll(currentDomain.identifier, false, function(mimePolicies) {
          return mimePolicies;
        });
      }
    };

    var funcAccountExpiration = function(currentUser, Functionality) {
      if (currentUser) {
        return Functionality.get(currentUser.domain , 'ACCOUNT_EXPIRATION', function(functionality) {
          return functionality;
        });
      }
    };
    var funcRestrictedGuest = function(currentUser, Functionality) {
      if (currentUser) {
        return Functionality.get(currentUser.domain , 'RESTRICTED_GUEST', function(functionality) {
          return functionality;
        });
      }
    };

    var enumRole = function(Enum) {
      return Enum.getOptions('role', function(roles) {
        return roles;
      });
    };
    var enumLanguage = function(Enum) {
      return Enum.getOptions('language', function(languages) {
        return languages;
      });
    };
    var enumLogAction = function(Enum) {
      return Enum.getOptions('log_action', function(actions) {
        return actions;
      });
    };
    var enumDomainAccessRuleTypes = function(Enum) {
      return Enum.getOptions('domain_access_rule_type', function(rules) {
        return rules;
      });
    };

    var authenticatedUser = function(Authentication) {
      return Authentication.getCurrentUser().then(function(user) {
        return user;
      });
    };

    // Common views
    var domainTreeView = {
      templateUrl: 'ng_components/domain/domain_tree.tpl.html',
      controller: 'DomainTreeCtrl',
      resolve: {
        rootDomain: function(Domain, authenticatedUser) {
          return Domain.getDomainTree(authenticatedUser.domain, function(domain) {
            return domain;
          });
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
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('functionality.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/functionality/functionality_list.tpl.html',
            controller: 'FunctionalityListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              functionalities: function(Functionality, currentDomain) {
                if (currentDomain) {
                  return Functionality.getAll(currentDomain.identifier, function(functionalities) {
                    return functionalities;
                  });
                }
              }
            }
          },
        },
      })
      .state('functionality.detail', {
        url: '/detail/:id?domainId',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/functionality/functionality_detail.tpl.html',
            controller: 'FunctionalityDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId, function(domain) {
                  return domain;
                });
              },
              currentFunctionality: function(Functionality, $stateParams) {
                return Functionality.getAll($stateParams.domainId, function(functionalities) {
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
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('mimepolicy.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mimepolicy/mimepolicy_list.tpl.html',
            controller: 'MimePolicyListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              mimePolicies: function(MimePolicy, currentDomain) {
                if (currentDomain) {
                  return MimePolicy.getAll(currentDomain.identifier, true, function(mimePolicies) {
                    return mimePolicies;
                  });
                }
              }
            }
          },
        },
      })
      .state('mimepolicy.detail', {
        url: '/detail/:id?domainId',
        views: {
          'detail': {
            templateUrl: 'ng_components/mimepolicy/mimepolicy_detail.tpl.html',
            controller: 'MimePolicyDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              currentMimePolicy: function($stateParams, MimePolicy) {
                 return MimePolicy.get($stateParams.id, true, function(mimePolicy) {
                   return mimePolicy;
                });
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
            return User.getAllInconsistent(function(users) {
              return users;
            });
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
          allDomains: allDomains,
        },
        templateUrl: 'ng_components/inconsistentuser/inconsistentuser_detail.tpl.html',
        controller: 'InconsistentUserDetailCtrl',
      })

      .state('thread', {
        abstract: true,
        url: '/thread',
        templateUrl: 'ng_components/thread/thread.html'
      })
      .state('thread.list', {
        url: '/list',
        templateUrl: 'ng_components/thread/thread_list.tpl.html',
        controller: 'ThreadListCtrl',
        resolve: {
          threads: allThreads,
        }
      })
      .state('thread.detail', {
        url: '/:id',
        templateUrl: 'ng_components/thread/thread_detail.tpl.html',
        controller: 'ThreadDetailCtrl',
        resolve: {
          currentThread: function($stateParams, Thread) {
            if ($stateParams.id) {
              return Thread.get($stateParams.id, function(thread) {
                return thread;
              });
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
          mailingLists: allMailingLists,
        }
      })
      .state('mailinglist.detail', {
        url: '/:id',
        templateUrl: 'ng_components/mailinglist/mailinglist_detail.tpl.html',
        controller: 'MailingListDetailCtrl',
        resolve: {
          currentMailingList: function($stateParams, MailingList) {
            if ($stateParams.id) {
              return MailingList.get($stateParams.id, function(mailingList) {
                return mailingList;
              });
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
              _allDomains: allDomains,
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
          ldapConnections: allLdapConnections,
        }
      })
      .state('ldapconnection.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/ldapconnection/ldapconnection_detail.tpl.html',
        controller: 'LdapConnectionDetailCtrl',
        resolve: {
          currentLdapConnection: function($stateParams, LdapConnection) {
            if ($stateParams.id) {
              return LdapConnection.get($stateParams.id, function(ldapConnection) {
                return ldapConnection;
              });
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
          domainPatterns: allDomainPatterns,
        }
      })
      .state('domainpattern.detail', {
        url: '/:id?formState',
        templateUrl: 'ng_components/domainpattern/domainpattern_detail.tpl.html',
        controller: 'DomainPatternDetailCtrl',
        resolve: {
          currentDomainPattern: function($stateParams, DomainPattern) {
            if ($stateParams.id) {
              return DomainPattern.get($stateParams.id, function(domainPattern) {
                return domainPattern;
              });
            }
          },
          models: function(DomainPattern) {
            return DomainPattern.getAllModels(function(models) {
              return models;
            });
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
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              _allLdapConnections: allLdapConnections,
              _allDomainPatterns: allDomainPatterns,
              _allDomainPolicies: allDomainPolicies,
              _allMailConfigs: allMailConfigs,
              _allMimePolicies: allMimePolicies,
              _enumRole: enumRole,
              _enumLanguage: enumLanguage,
            }
          }
        },
      })
    //  .state('domain.order', {
    //    url: '/order',
    //    templateUrl: 'ng_components/domain/domain_order.html',
    //    controller: 'DomainOrderCtrl'
    //  })
    //
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
          domainPolicies: allDomainPolicies,
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
              return DomainPolicy.get($stateParams.id, function(domainPolicy) {
                return domainPolicy;
              });
            }
          },
          _allDomains: allDomains,
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
        },
        controller: function($scope, $state) {
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('maillayout.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/maillayout/maillayout_list.tpl.html',
            controller: 'MailLayoutListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              mailLayouts: function(MailLayout, currentDomain) {
                if (currentDomain) {
                  return MailLayout.getAll(currentDomain.identifier, true, function(mailLayouts) {
                    return mailLayouts;
                  });
                }
              }
            }
          },
        },
      })
      .state('maillayout.detail', {
        url: '/detail/:id?domainId',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/maillayout/maillayout_detail.tpl.html',
            controller: 'MailLayoutDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId, function(domain) {
                  return domain;
                });
              },
              currentMailLayout: function(MailLayout, $stateParams) {
                return MailLayout.get($stateParams.domainId, $stateParams.id, function(maillayout) {
                  return maillayout;
                });
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
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('mailcontent.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailcontent/mailcontent_list.tpl.html',
            controller: 'MailContentListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              mailContents: function(MailContent, currentDomain) {
                if (currentDomain) {
                  return MailContent.getAll(currentDomain.identifier, true, function(mailContents) {
                    return mailContents;
                  });
                }
              }
            }
          },
        },
      })
      .state('mailcontent.detail', {
        url: '/detail/:id?domainId',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/mailcontent/mailcontent_detail.tpl.html',
            controller: 'MailContentDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId, function(domain) {
                  return domain;
                });
              },
              currentMailContent: function(MailContent, $stateParams) {
                return MailContent.get($stateParams.domainId, $stateParams.id, function(mailcontent) {
                  return mailcontent;
                });
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
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('mailfooter.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailfooter/mailfooter_list.tpl.html',
            controller: 'MailFooterListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              mailFooters: function(MailFooter, currentDomain) {
                if (currentDomain) {
                  return MailFooter.getAll(currentDomain.identifier, true, function(mailFooters) {
                    return mailFooters;
                  });
                }
              }
            }
          },
        },
      })
      .state('mailfooter.detail', {
        url: '/detail/:id?domainId',
        views: {
          'tree': domainTreeView,
          'detail': {
            templateUrl: 'ng_components/mailfooter/mailfooter_detail.tpl.html',
            controller: 'MailFooterDetailCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId, function(domain) {
                  return domain;
                });
              },
              currentMailFooter: function(MailFooter, $stateParams) {
                return MailFooter.get($stateParams.domainId, $stateParams.id, function(mailfooter) {
                  return mailfooter;
                });
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
          // Needed to conditional view loading
          $scope.$state = $state;
        }
      })
      .state('mailconfig.list', {
        url: '/list?domainId',
        views: {
          'tree': domainTreeView,
          'list': {
            templateUrl: 'ng_components/mailconfig/mailconfig_list.tpl.html',
            controller: 'MailConfigListCtrl',
            resolve: {
              currentDomain: function(Domain, $stateParams) {
                if ($stateParams.domainId) {
                  return Domain.get($stateParams.domainId, function(domain) {
                    return domain;
                  });
                }
              },
              mailConfigs: function(MailConfig, currentDomain) {
                if (currentDomain) {
                  return MailConfig.getAll(currentDomain.identifier, true, function(mailConfigs) {
                    return mailConfigs;
                  });
                }
              }
            }
          },
        },
      })
      .state('mailconfig.detail', {
        url: '/detail/:id?domainId&language&mailContentLangId',
        views: {
          'detail': {
            templateUrl: 'ng_components/mailconfig/mailconfig_detail.tpl.html',
            controller: 'MailConfigDetailCtrl',
            resolve: {
              mailLayouts: function(MailLayout, $stateParams) {
                return MailLayout.getAll($stateParams.domainId, false, function(mailLayouts) {
                  return mailLayouts;
                });
              },
              mailFooterLangs: function(MailConfig, $stateParams) {
                return MailConfig.getAllMailFooters($stateParams.id, $stateParams.language, function(mailFooterLangs) {
                  return mailFooterLangs;
                });
              },
              currentDomain: function(Domain, $stateParams) {
                return Domain.get($stateParams.domainId, function(domain) {
                  return domain;
                });
              },
              currentMailConfig: function(MailConfig, $stateParams) {
                return MailConfig.get($stateParams.domainId, $stateParams.id, function(mailconfig) {
                  return mailconfig;
                });
              }
            }
          },
          'mailcontentlang': {
            templateUrl: 'ng_components/mailcontent/mailcontentlang_detail.tpl.html',
            controller: 'MailContentLangDetailCtrl',
            resolve: {
              currentMailContentLang: function(MailContentLang, $stateParams, $q) {
                if ($stateParams.mailContentLangId) {
                  return MailContentLang.get($stateParams.mailContentLangId, function(mailContentLang) {
                    return mailContentLang;
                  });
                }
              },
              mailContents: function(MailConfig, currentMailContentLang, $stateParams) {
                if (currentMailContentLang) {
                  return MailConfig.getAllMailContents($stateParams.id, currentMailContentLang.language, currentMailContentLang.mailContentType, function(mailContents) {
                    return mailContents;
                  });
                }
              },
            }
          }
        },
      })
    //
    //    .state('mailconfig', {
    //      abstract: true,
    //      url: '/mailconfig',
    //      templateUrl: 'ng_components/mailconfig/mailconfig.html'
    //    })
    //    .state('mailconfig.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/mailconfig/mailconfig_list.html',
    //          controller: 'ng_components/mailconfig/mailconfig_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailconfig.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailconfig/mailconfig_detail.html',
    //      controller: 'ng_components/mailconfig/mailconfig_detail-controller.js'
    //    })
    //    .state('mailconfig.mailcontentlang', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailconfig/mailconfig_mailcontentlang.html',
    //      controller: 'ng_components/mailconfig/mailconfig_mailcontentlang-controller.js'
    //    })
    //
    //    .state('password', {
    //      url: '/password'
    //      templateUrl: 'ng_components/password/password.html',
    //      controller: 'ng_components/password/password-controller.js'
    //    })
  }
]);
