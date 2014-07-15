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
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'restangular',
    'checklist-model'
])

// Register work which needs to be performed on module loading
.config(['$logProvider', '$translateProvider', 'RestangularProvider', 'uiSelectConfig', 'cfpLoadingBarProvider', 'tmhDynamicLocaleProvider', 'lsAppConfig',
  function($logProvider, $translateProvider, RestangularProvider, uiSelectConfig, cfpLoadingBarProvider, tmhDynamicLocaleProvider, lsAppConfig) {
    var debug = document.cookie.linshareDebug || lsAppConfig.debug;
    $logProvider.debugEnabled(debug);

    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useCookieStorage();

    tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular/angular-locale_{{locale}}.js');

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
    RestangularProvider.addFullRequestInterceptor(function (element, operation, route, url, headers) {
      // Bypass basic authentication
      headers['WWW-No-Authenticate'] = 'linshare';
      if (element) {
        delete element.originalElement;
      }
      return element;
    });

    uiSelectConfig.theme = 'bootstrap';
    cfpLoadingBarProvider.includeSpinner = false;
}])

// Register work which should be performed when the injector is done loading all modules 
.run(['$log', 'Restangular', 'Notification',
  function($log, Restangular, Notification) {
    Restangular.setErrorInterceptor(function(response) {
      $log.error(response);
      if (response.status !== 200 && response.status !== 401) {
        Notification.addError(response.data);
      }
      return response;
    });
  }
]);
