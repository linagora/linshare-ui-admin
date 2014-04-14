'use strict';

require.config({
  paths: {
    /**
     * Be careful to use minify lib for dev/debug
     */
   
    // Angular & modules
    angular: '/components/angular/angular',
    ngsanitize: '/components/angular-sanitize/angular-sanitize.min',
    ngcookies: '/components/angular-cookies/angular-cookies.min',
    ngresource: '/components/angular-resource/angular-resource',
    ngroute: '/components/angular-route/angular-route',
    bootstrap: '/components/angular-bootstrap/ui-bootstrap.min',
    bootstrapTpls: '/components/angular-bootstrap/ui-bootstrap-tpls.min',
    uiSelect: '/components/angular-ui-select/dist/select',
    ngtable: '/components/ng-table-git/ng-table',
    restangular: '/components/restangular/src/restangular',
    httpAuthInterceptor: '/components/angular-http-auth/src/http-auth-interceptor',
    loadingBar: '/components/angular-loading-bar/build/loading-bar.min',

    // Unpackaged lib
    localize: '/unpackaged-lib/internal/localize',
 
    // Utils
    html5shiv: '/components/html5shiv/html5shiv',
    lodash: '/components/lodash/dist/lodash',
    jquery: '/components/jquery/dist/jquery.min',
    base64: '/components/js-base64/base64.min'
  },
  shim: { 
    /**
     * Angular
     */

    'angular':
        {deps: ['jquery'], exports: 'angular'},
    'jquery':
        {exports: 'angular'},
    'app':
        {deps: ['angular']},
    'filters/filters':
        {deps: ['angular', 'app']},
    'controllers/controllers':
        {deps: ['angular', 'app']},
    'services/services':
        {deps: ['angular', 'app']},
    'directives/directives':
        {deps: ['angular', 'app']},
    'routes':
        {deps: ['angular', 'app']},
    
    // Modules
    'ngsanitize':
        {deps: ['angular']},
    'ngcookies':
        {deps: ['angular']},
    'ngresource':
        {deps: ['angular']},
    'ngroute':
        {deps: ['angular']},
    'bootstrap':
        {deps: ['angular']},
    'bootstrapTpls':
        {deps: ['angular', 'bootstrap']},
    'uiSelect':
        {deps: ['angular']},
    'ngtable':
        {deps: ['angular']},
    'restangular':
        {deps: ['angular', 'lodash']},
    'httpAuthInterceptor':
        {deps: ['angular']},
    'loadingBar':
        {deps: ['angular']},

    // Unpackaged lib
    'localize':
        {deps: ['angular']},

    // Filters

    // Controllers
    'controllers/reset':
        {deps: ['controllers/controllers']},
    'controllers/confirmDialog':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/grid':
        {deps: ['controllers/controllers']},
    'controllers/loginForm':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/ldapconnection':
        {deps: ['controllers/controllers', 'ngtable']},
    'controllers/domainpattern':
        {deps: ['controllers/controllers', 'ngtable']},
    'controllers/domainmanagement':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/domainpolicy':
        {deps: ['controllers/controllers']},
    'controllers/functionalitymanagement':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/usermanagement':
        {deps: ['controllers/controllers']},
    'controllers/thread':
        {deps: ['controllers/controllers']},
    'controllers/mail':
        {deps: ['controllers/controllers']},

    // Services
    'services/preferences':
        {deps: ['services/services']},
    'services/authentication':
        {deps: ['services/services']},
    'services/tab':
        {deps: ['services/services']},
    'services/notification':
        {deps: ['services/services']},
    'services/domain':
        {deps: ['services/services']},
    'services/domainpattern':
        {deps: ['services/services']},
    'services/ldapconnection':
        {deps: ['services/services']},
    'services/domainpolicy':
        {deps: ['services/services']},
    'services/userrole':
        {deps: ['services/services']},
    'services/functionality':
        {deps: ['services/services']},
    'services/thread':
        {deps: ['services/services']},
    'services/threadmember':
        {deps: ['services/services']},
    'services/mail':
        {deps: ['services/services']},
    'services/user':
        {deps: ['services/services']},
    'services/audit':
        {deps: ['services/services']},

    // Directives
    'directives/parameters/functionalityList':
        {deps: ['directives/directives']},
    'directives/parameters/functionalityForm':
        {deps: ['directives/directives']},

    'directives/domains/ldapConnectionList':
        {deps: ['directives/directives']},
    'directives/domains/ldapConnectionForm':
        {deps: ['directives/directives']},
    'directives/domains/domainPatternList':
        {deps: ['directives/directives']},
    'directives/domains/domainPatternForm':
        {deps: ['directives/directives']},
    'directives/domains/domainTree':
        {deps: ['directives/directives']},
    'directives/domains/domainForm':
        {deps: ['directives/directives']},
    'directives/domains/domainPolicyList':
        {deps: ['directives/directives']},
    'directives/domains/domainPolicyForm':
        {deps: ['directives/directives']},
    
    'directives/users/userForm':
        {deps: ['directives/directives']},
    'directives/users/userList':
        {deps: ['directives/directives']},
    'directives/users/threadList':
        {deps: ['directives/directives']},
    'directives/users/threadForm':
        {deps: ['directives/directives']},
    'directives/users/mailList':
        {deps: ['directives/directives']},
    'directives/users/mailForm':
        {deps: ['directives/directives']},

    'directives/history/auditForm':
        {deps: ['directives/directives']},

    'directives/common/formAttempt':
        {deps: ['directives/directives']},
    'directives/common/formSubmit':
        {deps: ['directives/directives']},
    'directives/common/navbar':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/common/sidebar':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/common/alertBox':
        {deps: ['directives/directives']},
    'directives/common/alertTimeout':
        {deps: ['directives/directives']},
    'directives/common/footer':
        {deps: ['directives/directives']},

    /**
     * Utils
     */

    'lodash':
        {exports: '_'},
    'base64':
        {deps: ['angular']}
  },
  priority: [
    'angular'
  ],
  urlArgs: 'v=1.1'
});

var dependencies = [
  /**
   * Angular & modules
   */
  'angular',
  'app',
  'filters/filters',
  'controllers/controllers',
  'services/services',
  'directives/directives',
  'routes',

  // Modules
  'ngsanitize',
  'ngcookies',
  'ngresource',
  'ngroute',
  'bootstrap',
  'bootstrapTpls',
  'uiSelect',
  'ngtable',
  'restangular',
  'httpAuthInterceptor',
  'loadingBar',
  
  // Unpackaged lib
  'localize',

  // Filters

  // Controllers
  'controllers/reset',
  'controllers/confirmDialog',
  'controllers/grid',
  'controllers/loginForm',
  'controllers/ldapconnection',
  'controllers/domainpattern',
  'controllers/domainmanagement',
  'controllers/domainpolicy',
  'controllers/functionalitymanagement',
  'controllers/usermanagement',
  'controllers/thread',
  'controllers/mail',

  // Services
  'services/preferences',
  'services/authentication',
  'services/tab',
  'services/notification',
  'services/domain',
  'services/domainpattern',
  'services/ldapconnection',
  'services/domainpolicy',
  'services/userrole',
  'services/functionality',
  'services/thread',
  'services/threadmember',
  'services/mail',
  'services/user',
  'services/audit',

  // Directives
  'directives/parameters/functionalityList',
  'directives/parameters/functionalityForm',

  'directives/domains/ldapConnectionList',
  'directives/domains/ldapConnectionForm',
  'directives/domains/domainPatternList',
  'directives/domains/domainPatternForm',
  'directives/domains/domainTree',
  'directives/domains/domainForm',
  'directives/domains/domainPolicyList',
  'directives/domains/domainPolicyForm',

  'directives/users/userForm',
  'directives/users/userList',
  'directives/users/threadList',
  'directives/users/threadForm',
  'directives/users/mailList',
  'directives/users/mailForm',

  'directives/history/auditForm',

  'directives/common/formAttempt',
  'directives/common/formSubmit',
  'directives/common/navbar',
  'directives/common/sidebar',
  'directives/common/alertBox',
  'directives/common/alertTimeout',
  'directives/common/footer',

  /**
   * Utils
   */
  'lodash',
  'base64'
];

/**
 *  Check if the browser is IE9, if true add html5 compatibility
 */
if(document.getElementById('ie9')) {
  dependencies.push('html5shiv');
}

require(dependencies, function(angular) {
  angular.bootstrap(document, ['myApp']);
});
