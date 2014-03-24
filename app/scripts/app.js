'use strict';
/*jshint undef:false*/

// Holds the list of modules which the injector will load before the current module is loaded
var app = angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives',
    'myApp.filters',
    'myApp.services',
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'ngCookies',
    'ngGrid',
    'ngTable',
    'http-auth-interceptor',
    'localization',
    'restangular'
])

// Register work which needs to be performed on module loading
.config(['$logProvider', 'preferencesServiceProvider', 'RestangularProvider',
  function($logProvider, preferencesProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/linshare/webservice/rest/admin');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
    var settings = preferencesProvider.loadSettings();
    var debug = document.cookie.linshareDebug || settings.debug;
    $logProvider.debugEnabled(debug);
}])

// Register work which should be performed when the injector is done loading all modules 
.run(['$log', 'localize', 'preferencesService', 'Restangular', 'Notification',
  function($log, Localize, Preferences, Restangular, Notification) {
    Restangular.setErrorInterceptor(function(response) {
      $log.error(response);
      if (response.status === 400) {
        Notification.addError(response.data);
      }
      return response;
    });
    Localize.initLocalizedResources();
  }
]);

/*jshint undef:true*/
