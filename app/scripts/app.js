'use strict';

// Holds the list of modules which the injector will load before the current module is loaded
angular.module('linshareAdminApp', [
    'ui.bootstrap',
    'ngLocale',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'ngCookies',
    'ui.select',
    'ngTable',
    'http-auth-interceptor',
    'chieffancypants.loadingBar',
    'localization',
    'restangular'
])

// Register work which needs to be performed on module loading
.config(['$logProvider', 'RestangularProvider', 'uiSelectConfig', 'cfpLoadingBarProvider', 'lsAppConfig',
  function($logProvider, RestangularProvider, uiSelectConfig, cfpLoadingBarProvider, lsAppConfig) {
    cfpLoadingBarProvider.includeSpinner = false;
    uiSelectConfig.theme = 'bootstrap';
    RestangularProvider.setBaseUrl(lsAppConfig.backendURL);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
    RestangularProvider.addResponseInterceptor(function(data) {
      var newResponse = data;
      if (angular.isArray(data)) {
        angular.forEach(newResponse, function(value, key) {
          newResponse[key].originalElement = angular.copy(value);
        });
      } else {
        newResponse.originalElement = angular.copy(data);
      }

      return newResponse;
    });
    RestangularProvider.addRequestInterceptor(function(element) {
      if (element) {
        delete element.originalElement;
      }
      return element;
    });
    var debug = document.cookie.linshareDebug || lsAppConfig.debug;
    $logProvider.debugEnabled(debug);
}])

// Register work which should be performed when the injector is done loading all modules 
.run(['$log', 'Restangular', 'Notification', 'localize',
  function($log, Restangular, Notification, localize) {
    Restangular.setErrorInterceptor(function(response) {
      $log.error(response);
      if (response.status !== 400) {
        Notification.addError(response.data);
      }
      return response;
    });
    localize.initLocalizedResources();
  }
]);
