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
    plupload: '/components/plupload/src/javascript/plupload',
    plupload_queue: '/components/plupload/src/javascript/jquery.plupload.queue/jquery.plupload.queue',
    plupload_html5: '/components/plupload/src/javascript/plupload.html5',
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
    'controllers/domainPatterns':
        {deps: ['controllers/controllers']},

    // Services
    'services/preferences':
        {deps: ['services/services']},
    'services/logger':
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


    /**
     * Utils
     */

    'lodash':
        {exports: '_'},
    'plupload':
        {deps: ['angular', 'jquery'], exports: 'plupload'},
    'plupload_queue':
        {deps: ['plupload']},
    'plupload_html5':
        {deps: ['plupload']},
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
  'controllers/domainPatterns',

  // Services
  'services/preferences',
  'services/logger',

  // Directives
  'directives/gridThreadMembers',
  'directives/gridThreads',
  'directives/gridUsers',
  'directives/gridDomainPatterns',
  'directives/loginForm',
  'directives/navbar',
  'directives/footer',
  'directives/listTree',
  'directives/loadingAnimation',

  /**
   * Utils
   */
  'lodash',
  'base64',
  'plupload',
  'plupload_queue',
  'plupload_html5'

], function(angular, app) {
  angular.bootstrap(document, ['myApp']);
});
