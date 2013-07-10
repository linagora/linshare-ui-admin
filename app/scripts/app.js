'use strict';
/*jshint undef:false*/

// Holds the list of modules which the injector will load before the current module is loaded
var app = angular.module('myApp', ['myApp.directives',
    'myApp.filters',
    'myApp.services',
    'ui.bootstrap',
    'ngResource',
    'ngCookies',
    'ngGrid',
    'http-auth-interceptor',
    'localization',
    'restangular'
])

// Register work which needs to be performed on module loading
.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl("/linshare/webservice/rest/admin");
  //RestangularProvider.setRequestSuffix('.json');
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
})

// Register work which should be performed when the injector is done loading all modules 
.run(['localize', 'preferencesService', 'loggerService',
  function(Localize, Preferences, Logger) {
    Preferences.load();
    Localize.initLocalizedResources();
  }
]);

/*jshint undef:true*/
