'use strict';

require.config({
  paths: {
    /**
     * Careful to use minify lib for dev/debug
     */
   
    // Angular & modules
    angular: '/components/angular/angular',
    ngcookies: '/components/angular-cookies/angular-cookies.min',
    ngresource: '/components/angular-resource/angular-resource',
    ngroute: '/components/angular-route/angular-route',
    bootstrap: '/components/angular-bootstrap/ui-bootstrap.min',
    bootstrapTpls: '/components/angular-bootstrap/ui-bootstrap-tpls.min',
    nggrid: '/components/ng-grid/build/ng-grid.min',
    nggridFlexibleHeight: '/components/ng-grid/plugins/ng-grid-flexible-height',
    ngtable: '/components/ng-table/ng-table',
    restangular: '/components/restangular/src/restangular',
    httpAuthInterceptor: '/components/angular-http-auth/src/http-auth-interceptor',

    // Unpackaged lib
    localize: '/unpackaged-lib/internal/localize',
 
    // Utils
    html5shiv: '/components/html5shiv/html5shiv',
    jquery: '/components/jquery/dist/jquery.min',
    lodash: '/components/lodash/dist/lodash',
    base64: '/components/js-base64/base64.min'
  },
  shim: { 
    /**
     * Angular
     */

    'angular':
        {deps: ['jquery'], exports: 'angular'},
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
    'nggrid':
        {deps: ['jquery', 'angular']},
    'nggridFlexibleHeight':
        {deps: ['nggrid']},
    'ngtable':
        {deps: ['angular']},
    'restangular':
        {deps: ['angular', 'lodash']},
    'httpAuthInterceptor':
        {deps: ['angular']},

    // Unpackaged lib
    'localize':
        {deps: ['angular']},

    // Filters

    // Controllers
    'controllers/confirmDialog':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/grid':
        {deps: ['controllers/controllers']},
    'controllers/userManagement':
        {deps: ['controllers/controllers']},
    'controllers/loginForm':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/ldapconnection':
        {deps: ['controllers/controllers', 'ngtable']},
    'controllers/domainpattern':
        {deps: ['controllers/controllers', 'ngtable']},
    'controllers/domainmanagement':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/functionalitymanagement':
        {deps: ['controllers/controllers', 'bootstrap']},
    'controllers/thread':
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

    // Directives
    'directives/administration/functionalityList':
        {deps: ['directives/directives']},
    'directives/administration/functionalityForm':
        {deps: ['directives/directives']},

    'directives/domains/ldapConnectionForm':
        {deps: ['directives/directives']},
    'directives/domains/domainPatternForm':
        {deps: ['directives/directives']},
    'directives/domains/domainTree':
        {deps: ['directives/directives']},
    'directives/domains/domainForm':
        {deps: ['directives/directives']},
    
    'directives/threads/threadGrid':
        {deps: ['directives/directives', 'nggrid']},
    'directives/threads/threadMemberGrid':
        {deps: ['directives/directives', 'nggrid']},

    'directives/users/userCompletion':
        {deps: ['directives/directives']},
    'directives/users/userEditForm':
        {deps: ['directives/directives']},
    'directives/users/userList':
        {deps: ['directives/directives', 'nggrid']},

    'directives/common/formAttempt':
        {deps: ['directives/directives']},
    'directives/common/formSubmit':
        {deps: ['directives/directives']},
    'directives/common/navbar':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/common/alertBox':
        {deps: ['directives/directives']},
    'directives/common/alertTimeout':
        {deps: ['directives/directives']},
    'directives/common/footer':
        {deps: ['directives/directives']},
    'directives/common/loadingAnimation':
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
  'ngcookies',
  'ngresource',
  'ngroute',
  'bootstrap',
  'bootstrapTpls',
  'nggrid',
  'nggridFlexibleHeight',
  'ngtable',
  'restangular',
  'httpAuthInterceptor',
  
  // Unpackaged lib
  'localize',

  // Filters

  // Controllers
  'controllers/confirmDialog',
  'controllers/grid',
  'controllers/userManagement',
  'controllers/loginForm',
  'controllers/ldapconnection',
  'controllers/domainpattern',
  'controllers/domainmanagement',
  'controllers/functionalitymanagement',
  'controllers/thread',

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

  // Directives
  'directives/administration/functionalityList',
  'directives/administration/functionalityForm',

  'directives/domains/ldapConnectionForm',
  'directives/domains/domainPatternForm',
  'directives/domains/domainTree',
  'directives/domains/domainForm',

  'directives/threads/threadMemberGrid',
  'directives/threads/threadGrid',
  
  'directives/users/userEditForm',
  'directives/users/userCompletion',
  'directives/users/userList',

  'directives/common/formAttempt',
  'directives/common/formSubmit',
  'directives/common/navbar',
  'directives/common/alertBox',
  'directives/common/alertTimeout',
  'directives/common/footer',
  'directives/common/loadingAnimation',

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
