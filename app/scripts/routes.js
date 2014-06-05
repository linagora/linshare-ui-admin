'use strict';

angular.module('linshareAdminApp').config(['$routeProvider', '$stateProvider', '$urlRouterProvider',
  function($routeProvider, $stateProvider, $urlRouterProvider) {
    //  For any unmatched url, redirect
    //  $urlRouterProvider.otherwise("/user/list");

    //  $stateProvider
    //    .state('functionality', {
    //      abstract: true,
    //      url: '/functionality',
    //      templateUrl: 'ng_components/functionality/functionality.html'
    //    })
    //    .state('functionality.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/functionality/functionality-list.html',
    //          controller: 'ng_components/functionality/functionality-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('functionality.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/functionality/functionality-detail.html',
    //      controller: 'ng_components/functionality/functionality-detail-controller.js'
    //    })
    //
    //    .state('mimepolicy', {
    //      abstract: true,
    //      url: '/mimepolicy',
    //      templateUrl: 'ng_components/mimepolicy/mimepolicy.html'
    //    })
    //    .state('mimepolicy.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/mimepolicy/mimepolicy-list.html',
    //          controller: 'ng_components/mimepolicy/mimepolicy-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mimepolicy.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mimepolicy/mimepolicy-detail.html',
    //      controller: 'ng_components/mimepolicy/mimepolicy-detail-controller.js'
    //    })
    //
    //    .state('user', {
    //      abstract: true,
    //      url: '/user',
    //      templateUrl: 'ng_components/user/user.html'
    //    })
    //    .state('user.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/user/user-list.html',
    //          controller: 'ng_components/user/user-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('user.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/user/user-detail.html',
    //      controller: 'ng_components/user/user-detail-controller.js'
    //    })
    //
    //    .state('inconsistentuser', {
    //      abstract: true,
    //      url: '/inconsistentuser',
    //      templateUrl: 'ng_components/inconsistentuser/inconsistentuser.html'
    //    })
    //    .state('inconsistentuser.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/inconsistentuser/inconsistentuser-list.html',
    //          controller: 'ng_components/inconsistentuser/inconsistentuser-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('inconsistentuser.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/inconsistentuser/inconsistentuser-detail.html',
    //      controller: 'ng_components/inconsistentuser/inconsistentuser-detail-controller.js'
    //    })
    //
    //    .state('thread', {
    //      abstract: true,
    //      url: '/thread',
    //      templateUrl: 'ng_components/thread/thread.html'
    //    })
    //    .state('thread.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/thread/thread-list.html',
    //          controller: 'ng_components/thread/thread-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('thread.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/thread/thread-detail.html',
    //      controller: 'ng_components/thread/thread-detail-controller.js'
    //    })
    //
    //    .state('mailinglist', {
    //      abstract: true,
    //      url: '/mailinglist',
    //      templateUrl: 'ng_components/mailinglist/mailinglist.html'
    //    })
    //    .state('mailinglist.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/mailinglist/mailinglist-list.html',
    //          controller: 'ng_components/mailinglist/mailinglist-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailinglist.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailinglist/mailinglist-detail.html',
    //      controller: 'ng_components/mailinglist/mailinglist-detail-controller.js'
    //    })
    //
    //    .state('audit', {
    //      url: '/audit',
    //      templateUrl: 'ng_components/audit/audit.html'
    //      controller: 'ng_components/audit/audit-controller.js'
    //    })
    //
    //    .state('ldapconnection', {
    //      abstract: true,
    //      url: '/ldapconnection',
    //      templateUrl: 'ng_components/ldapconnection/ldapconnection.html'
    //    })
    //    .state('ldapconnection.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/ldapconnection/ldapconnection-list.html',
    //          controller: 'ng_components/ldapconnection/ldapconnection-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('ldapconnection.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/ldapconnection/ldapconnection-detail.html',
    //      controller: 'ng_components/ldapconnection/ldapconnection-detail-controller.js'
    //    })
    //
    //    .state('domainpattern', {
    //      abstract: true,
    //      url: '/domainpattern',
    //      templateUrl: 'ng_components/domainpattern/domainpattern.html'
    //    })
    //    .state('domainpattern.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/domainpattern/domainpattern-list.html',
    //          controller: 'ng_components/domainpattern/domainpattern-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('domainpattern.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domainpattern/domainpattern-detail.html',
    //      controller: 'ng_components/domainpattern/domainpattern-detail-controller.js'
    //    })
    //
    //    .state('domain', {
    //      url: '/domain',
    //      views: {
    //        'tree': {
    //          templateUrl: 'ng_components/domain/domain-tree.html',
    //          controller: 'ng_components/domain/domain-tree-controller.js',
    //        }
    //      }
    //    })
    //    .state('domain.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domain/domain-detail.html',
    //      controller: 'ng_components/domain/domain-detail-controller.js'
    //    })
    //    .state('domain.order', {
    //      url: '/order'
    //      templateUrl: 'ng_components/domain/domain-order.html',
    //      controller: 'ng_components/domain/domain-order-controller.js'
    //    })
    //
    //    .state('domainpolicy', {
    //      abstract: true,
    //      url: '/domainpolicy',
    //      templateUrl: 'ng_components/domainpolicy/domainpolicy.html'
    //    })
    //    .state('domainpolicy.list', {
    //      url: '/list',
    //      views: {
    //        'list': {
    //          templateUrl: 'ng_components/domainpolicy/domainpolicy-list.html',
    //          controller: 'ng_components/domainpolicy/domainpolicy-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('domainpolicy.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domainpolicy/domainpolicy-detail.html',
    //      controller: 'ng_components/domainpolicy/domainpolicy-detail-controller.js'
    //    })
    //
    //    .state('maillayout', {
    //      abstract: true,
    //      url: '/maillayout',
    //      templateUrl: 'ng_components/maillayout/maillayout.html'
    //    })
    //    .state('maillayout.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/maillayout/maillayout-list.html',
    //          controller: 'ng_components/maillayout/maillayout-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('maillayout.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/maillayout/maillayout-detail.html',
    //      controller: 'ng_components/maillayout/maillayout-detail-controller.js'
    //    })
    //
    //    .state('mailcontent', {
    //      abstract: true,
    //      url: '/mailcontent',
    //      templateUrl: 'ng_components/mailcontent/mailcontent.html'
    //    })
    //    .state('mailcontent.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/mailcontent/mailcontent-list.html',
    //          controller: 'ng_components/mailcontent/mailcontent-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailcontent.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailcontent/mailcontent-detail.html',
    //      controller: 'ng_components/mailcontent/mailcontent-detail-controller.js'
    //    })
    //
    //    .state('mailfooter', {
    //      abstract: true,
    //      url: '/mailfooter',
    //      templateUrl: 'ng_components/mailfooter/mailfooter.html'
    //    })
    //    .state('mailfooter.list', {
    //      url: '/list',
    //      views: {
    //        'tree@domain': {},
    //        'list': {
    //          templateUrl: 'ng_components/mailfooter/mailfooter-list.html',
    //          controller: 'ng_components/mailfooter/mailfooter-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailfooter.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailfooter/mailfooter-detail.html',
    //      controller: 'ng_components/mailfooter/mailfooter-detail-controller.js'
    //    })
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
    //          templateUrl: 'ng_components/mailconfig/mailconfig-list.html',
    //          controller: 'ng_components/mailconfig/mailconfig-list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailconfig.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailconfig/mailconfig-detail.html',
    //      controller: 'ng_components/mailconfig/mailconfig-detail-controller.js'
    //    })
    //    .state('mailconfig.mailcontentlang', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailconfig/mailconfig-mailcontentlang.html',
    //      controller: 'ng_components/mailconfig/mailconfig-mailcontentlang-controller.js'
    //    })
    //
    //    .state('password', {
    //      url: '/password'
    //      templateUrl: 'ng_components/password/password.html',
    //      controller: 'ng_components/password/password-controller.js'
    //    })
    //

    $routeProvider.when('/password', {
      templateUrl: 'views/password.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/ldap_connections', {
      templateUrl: 'views/domains/ldap_connections.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/domain_patterns', {
      templateUrl: 'views/domains/domain_patterns.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/management', {
      templateUrl: 'views/domains/domain_management.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/order', {
      templateUrl: 'views/domains/domain_order.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/policies', {
      templateUrl: 'views/domains/domain_policies.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/parameters/functionalities', {
      templateUrl: 'views/parameters/functionalities.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mime_policy', {
      templateUrl: 'views/parameters/mime_policy.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_layout', {
      templateUrl: 'views/parameters/mail_layout.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_footer', {
      templateUrl: 'views/parameters/mail_footer.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_content', {
      templateUrl: 'views/parameters/mail_content.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_config', {
      templateUrl: 'views/parameters/mail_config.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/upload_proposition_filter', {
      templateUrl: 'views/parameters/upload_proposition_filter.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/users', {
      templateUrl: 'views/users.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/management', {
      templateUrl: 'views/users/user_management.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/inconsistent', {
      templateUrl: 'views/users/inconsistent_users.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/threads', {
      templateUrl: 'views/users/threads.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/technical_account', {
      templateUrl: 'views/users/technical_account.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/mailing_lists', {
      templateUrl: 'views/users/mails.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/history/audit', {
      templateUrl: 'views/history/audit.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/history/upload_request', {
      templateUrl: 'views/history/upload_request.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/charts', {
      templateUrl: 'views/charts.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.otherwise({
      redirectTo: '/users/management'
    });
  }
]);
