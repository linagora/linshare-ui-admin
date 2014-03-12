'use strict';
/*jshint undef:false*/

// Holds the list of modules which the injector will load before the current module is loaded
var app = angular.module('myApp', ['myApp.directives',
    'myApp.filters',
    'myApp.services',
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'ngCookies',
    'ngGrid',
    'http-auth-interceptor',
    'localization',
    'restangular'
])

// Register work which needs to be performed on module loading
.config(function($logProvider, loggerProvider, RestangularProvider) {
  RestangularProvider.setBaseUrl('/linshare/webservice/rest/admin');
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
  $logProvider.debugEnabled(loggerProvider.isDebug);
})

// Register work which should be performed when the injector is done loading all modules 
.run(['$log', 'localize', 'preferencesService', 'userLoggedService', 'Restangular', 'notificationService',
  function($log, Localize, Preferences, userLogged, Restangular, notificationService) {
    Restangular.setErrorInterceptor(function(response) {
      $log.error(response);
      if (response.status === 400) {
        notificationService.addError(response.data);
      }
      return response;
    });
    Preferences.load();
    Localize.initLocalizedResources();
  }
]);

/*jshint undef:true*/
