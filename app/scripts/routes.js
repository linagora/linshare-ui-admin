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
    //          templateUrl: 'ng_components/functionality/functionality_list.html',
    //          controller: 'ng_components/functionality/functionality_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('functionality.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/functionality/functionality_detail.html',
    //      controller: 'ng_components/functionality/functionality_detail-controller.js'
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
    //          templateUrl: 'ng_components/mimepolicy/mimepolicy_list.html',
    //          controller: 'ng_components/mimepolicy/mimepolicy_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mimepolicy.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mimepolicy/mimepolicy_detail.html',
    //      controller: 'ng_components/mimepolicy/mimepolicy_detail-controller.js'
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
    //          templateUrl: 'ng_components/user/user_list.html',
    //          controller: 'ng_components/user/user_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('user.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/user/user_detail.html',
    //      controller: 'ng_components/user/user_detail-controller.js'
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
    //          templateUrl: 'ng_components/inconsistentuser/inconsistentuser_list.html',
    //          controller: 'ng_components/inconsistentuser/inconsistentuser_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('inconsistentuser.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/inconsistentuser/inconsistentuser_detail.html',
    //      controller: 'ng_components/inconsistentuser/inconsistentuser_detail-controller.js'
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
    //          templateUrl: 'ng_components/thread/thread_list.html',
    //          controller: 'ng_components/thread/thread_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('thread.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/thread/thread_detail.html',
    //      controller: 'ng_components/thread/thread_detail-controller.js'
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
    //          templateUrl: 'ng_components/mailinglist/mailinglist_list.html',
    //          controller: 'ng_components/mailinglist/mailinglist_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailinglist.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailinglist/mailinglist_detail.html',
    //      controller: 'ng_components/mailinglist/mailinglist_detail-controller.js'
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
    //          templateUrl: 'ng_components/ldapconnection/ldapconnection_list.html',
    //          controller: 'ng_components/ldapconnection/ldapconnection_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('ldapconnection.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/ldapconnection/ldapconnection_detail.html',
    //      controller: 'ng_components/ldapconnection/ldapconnection_detail-controller.js'
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
    //          templateUrl: 'ng_components/domainpattern/domainpattern_list.html',
    //          controller: 'ng_components/domainpattern/domainpattern_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('domainpattern.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domainpattern/domainpattern_detail.html',
    //      controller: 'ng_components/domainpattern/domainpattern_detail-controller.js'
    //    })
    //
    //    .state('domain', {
    //      url: '/domain',
    //      views: {
    //        'tree': {
    //          templateUrl: 'ng_components/domain/domain_tree.html',
    //          controller: 'ng_components/domain/domain_tree-controller.js',
    //        }
    //      }
    //    })
    //    .state('domain.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domain/domain_detail.html',
    //      controller: 'ng_components/domain/domain_detail-controller.js'
    //    })
    //    .state('domain.order', {
    //      url: '/order'
    //      templateUrl: 'ng_components/domain/domain_order.html',
    //      controller: 'ng_components/domain/domain_order-controller.js'
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
    //          templateUrl: 'ng_components/domainpolicy/domainpolicy_list.html',
    //          controller: 'ng_components/domainpolicy/domainpolicy_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('domainpolicy.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/domainpolicy/domainpolicy_detail.html',
    //      controller: 'ng_components/domainpolicy/domainpolicy_detail-controller.js'
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
    //          templateUrl: 'ng_components/maillayout/maillayout_list.html',
    //          controller: 'ng_components/maillayout/maillayout_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('maillayout.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/maillayout/maillayout_detail.html',
    //      controller: 'ng_components/maillayout/maillayout_detail-controller.js'
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
    //          templateUrl: 'ng_components/mailcontent/mailcontent_list.html',
    //          controller: 'ng_components/mailcontent/mailcontent_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailcontent.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailcontent/mailcontent_detail.html',
    //      controller: 'ng_components/mailcontent/mailcontent_detail-controller.js'
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
    //          templateUrl: 'ng_components/mailfooter/mailfooter_list.html',
    //          controller: 'ng_components/mailfooter/mailfooter_list-controller.js',
    //        }
    //      }
    //    })
    //    .state('mailfooter.detail', {
    //      url: '/:id'
    //      templateUrl: 'ng_components/mailfooter/mailfooter_detail.html',
    //      controller: 'ng_components/mailfooter/mailfooter_detail-controller.js'
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

    $routeProvider.when('/password', {
      templateUrl: 'ng_components/password/password.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/ldap_connections', {
      templateUrl: 'ng_components/ldapconnection/ldapconnection.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/domain_patterns', {
      templateUrl: 'ng_components/domainpattern/domainpattern.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/management', {
      templateUrl: 'ng_components/domain/domain.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/order', {
      templateUrl: 'ng_components/domain/domain_order.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/domains/policies', {
      templateUrl: 'ng_components/domainpolicy/domainpolicy.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/parameters/functionalities', {
      templateUrl: 'ng_components/functionality/functionality.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mime_policy', {
      templateUrl: 'ng_components/mimepolicy/mimepolicy.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_layout', {
      templateUrl: 'ng_components/maillayout/maillayout.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_footer', {
      templateUrl: 'ng_components/mailfooter/mailfooter.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_content', {
      templateUrl: 'ng_components/mailcontent/mailcontent.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/mail_config', {
      templateUrl: 'ng_components/mailconfig/mailconfig.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/parameters/upload_proposition_filter', {
      templateUrl: 'ng_components/uploadpropositionfilter/uploadpropositionfilter.html',
      controller: 'ResetCtrl'
    });

    //$routeProvider.when('/users', {
    //  templateUrl: 'ng_components/user/user.html',
    //  controller: 'ResetCtrl'
    //});
    $routeProvider.when('/users/management', {
      templateUrl: 'ng_components/user/user.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/inconsistent', {
      templateUrl: 'ng_components/inconsistentuser/inconsistentuser.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/threads', {
      templateUrl: 'ng_components/thread/thread.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/technical_account', {
      templateUrl: 'ng_components/technicalaccount/technicalaccount.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/users/mailing_lists', {
      templateUrl: 'ng_components/mailinglist/mailinglist.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.when('/history/audit', {
      templateUrl: 'ng_components/audit/audit.html',
      controller: 'ResetCtrl'
    });
    $routeProvider.when('/history/upload_request', {
      templateUrl: 'ng_components/uploadrequest/uploadrequest.html',
      controller: 'ResetCtrl'
    });

    $routeProvider.otherwise({
      redirectTo: '/users/management'
    });
  }
]);
