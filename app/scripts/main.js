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
    restangular: '/components/restangular/src/restangular',
    httpAuthInterceptor: '/components/angular-http-auth/src/http-auth-interceptor',

    // Unpackaged lib
    localize: '/unpackaged-lib/internal/localize',
 
    // Utils
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
    'restangular':
        {deps: ['angular', 'lodash']},
    'httpAuthInterceptor':
        {deps: ['angular']},

    // Unpackaged lib
    'localize':
        {deps: ['angular']},

    // Filters

    // Controllers
    'controllers/grid':
        {deps: ['controllers/controllers']},
    'controllers/domainManagement':
        {deps: ['controllers/controllers']},
    'controllers/userManagement':
        {deps: ['controllers/controllers']},
    'controllers/createAndEditForm':
        {deps: ['controllers/controllers']},

    // Services
    'services/preferences':
        {deps: ['services/services']},
    'services/logger':
        {deps: ['services/services']},
    'services/userLogged':
        {deps: ['services/services']},
    'services/manageDomain':
        {deps: ['services/services']},
    'services/notification':
        {deps: ['services/services']},

    // Directives
    'directives/loginForm':
        {deps: ['directives/directives', 'bootstrap']},

    'directives/administration/functionalityTree':
        {deps: ['directives/directives']},
    'directives/administration/functionalityList':
        {deps: ['directives/directives']},
    'directives/administration/functionalityEditForm':
        {deps: ['directives/directives']},

    'directives/domains/ldapConnectionCreateForm':
        {deps: ['directives/directives']},
    'directives/domains/ldapConnectionEditForm':
        {deps: ['directives/directives']},
    'directives/domains/ldapConnectionGrid':
        {deps: ['directives/directives', 'nggrid']},
    'directives/domains/domainPatternCreateForm':
        {deps: ['directives/directives']},
    'directives/domains/domainPatternEditForm':
        {deps: ['directives/directives']},
    'directives/domains/domainPatternGrid':
        {deps: ['directives/directives', 'nggrid']},
    'directives/domains/domainEditForm':
        {deps: ['directives/directives']},
    'directives/domains/domainCreateForm':
        {deps: ['directives/directives']},
    'directives/domains/domainTree':
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

require([
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
  'restangular',
  'httpAuthInterceptor',
  
  // Unpackaged lib
  'localize',

  // Filters

  // Controllers
  'controllers/grid',
  'controllers/domainManagement',
  'controllers/userManagement',
  'controllers/createAndEditForm',

  // Services
  'services/preferences',
  'services/logger',
  'services/userLogged',
  'services/manageDomain',
  'services/notification',

  // Directives
  'directives/loginForm',

  'directives/administration/functionalityTree',
  'directives/administration/functionalityList',
  'directives/administration/functionalityEditForm',

  'directives/domains/ldapConnectionCreateForm',
  'directives/domains/ldapConnectionEditForm',
  'directives/domains/ldapConnectionGrid',
  'directives/domains/domainPatternCreateForm',
  'directives/domains/domainPatternEditForm',
  'directives/domains/domainPatternGrid',
  'directives/domains/domainCreateForm',
  'directives/domains/domainEditForm',
  'directives/domains/domainTree',

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

], function(angular, app) {
  angular.bootstrap(document, ['myApp']);
});
