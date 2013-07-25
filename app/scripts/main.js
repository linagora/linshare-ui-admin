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
    bootstrap: '/components/angular-bootstrap/ui-bootstrap.min',
    bootstrap_tpls: '/components/angular-bootstrap/ui-bootstrap-tpls.min',
    nggrid: '/components/ng-grid/build/ng-grid.min',
    nggrid_flexibleheight: '/components/ng-grid/plugins/ng-grid-flexible-height',
    restangular: '/components/restangular/src/restangular',

    // Unpackaged lib
    localize: '/unpackaged-lib/internal/localize',
    http_auth_interceptor: '/unpackaged-lib/internal/http-auth-interceptor',
 
    // Utils
    jquery: '/components/jquery/jquery.min',
    lodash: '/components/lodash/lodash',
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
    'bootstrap':
        {deps: ['angular']},
    'bootstrap_tpls':
        {deps: ['angular', 'bootstrap']},
    'nggrid':
        {deps: ['jquery', 'angular']},
    'nggrid_flexibleheight':
        {deps: ['nggrid']},
    'restangular':
        {deps: ['angular', 'lodash']},

    // Unpackaged lib
    'http_auth_interceptor':
        {deps: ['angular']},
    'localize':
        {deps: ['angular']},

    // Filters
    'filters/threadMemberRole':
        {deps: ['filters/filters']},

    // Controllers
    'controllers/grid':
        {deps: ['controllers/controllers']},
    'controllers/threadDetail':
        {deps: ['controllers/controllers']},
    'controllers/userDetail':
        {deps: ['controllers/controllers']},
    'controllers/share':
        {deps: ['controllers/controllers']},
    'controllers/domainManagement':
        {deps: ['controllers/controllers']},

    // Services
    'services/preferences':
        {deps: ['services/services']},
    'services/logger':
        {deps: ['services/services']},
    'services/manageDomain':
        {deps: ['services/services']},

    // Directives
    'directives/gridThreads':
        {deps: ['directives/directives', 'nggrid']},
    'directives/gridThreadMembers':
        {deps: ['directives/directives', 'nggrid']},
    'directives/gridUsers':
        {deps: ['directives/directives', 'nggrid']},
    'directives/gridDomainPatterns':
        {deps: ['directives/directives', 'nggrid']},
    'directives/gridLdapConnections':
        {deps: ['directives/directives', 'nggrid']},
    'directives/loginForm':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/navbar':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/footer':
        {deps: ['directives/directives']},
    'directives/listTree':
        {deps: ['directives/directives', 'bootstrap']},
    'directives/loadingAnimation':
        {deps: ['directives/directives']},
    'directives/domainEditForm':
        {deps: ['directives/directives']},
    'directives/domainCreateForm':
        {deps: ['directives/directives']},
    'directives/domainPatternForm':
        {deps: ['directives/directives']},
    'directives/ldapConnectionForm':
        {deps: ['directives/directives']},
    'directives/domainTree':
        {deps: ['directives/directives']},
    'directives/autocompleteUser':
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
  'bootstrap',
  'bootstrap_tpls',
  'nggrid',
  'nggrid_flexibleheight',
  'restangular',
  
  // Unpackaged lib
  'http_auth_interceptor',
  'localize',

  // Filters
  'filters/threadMemberRole',

  // Controllers
  'controllers/grid',
  'controllers/threadDetail',
  'controllers/userDetail',
  'controllers/share',
  'controllers/domainManagement',

  // Services
  'services/preferences',
  'services/logger',
  'services/manageDomain',

  // Directives
  'directives/gridThreadMembers',
  'directives/gridThreads',
  'directives/gridUsers',
  'directives/gridDomainPatterns',
  'directives/gridLdapConnections',
  'directives/loginForm',
  'directives/navbar',
  'directives/footer',
  'directives/listTree',
  'directives/loadingAnimation',
  'directives/domainCreateForm',
  'directives/domainEditForm',
  'directives/domainPatternForm',
  'directives/ldapConnectionForm',
  'directives/domainTree',
  'directives/autocompleteUser',

  /**
   * Utils
   */
  'lodash',
  'base64'

], function(angular, app) {
  angular.bootstrap(document, ['myApp']);
});
