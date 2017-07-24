'use strict';

// Holds the list of modules which the injector will load before the current module is loaded
angular.module('linshareAdminApp', [
    'ui.bootstrap',
    'ui.router',
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
    'checklist-model',
    'toggle-switch',
    'lsDropdownApp',
    'angularMoment',
    'luegg.directives'
])

// Register work which needs to be performed on module loading
.config(['$provide', '$logProvider', '$translateProvider', '$translatePartialLoaderProvider', 'RestangularProvider', 'uiSelectConfig',
  'cfpLoadingBarProvider', 'tmhDynamicLocaleProvider', 'lsAppConfig',
  function($provide, $logProvider, $translateProvider, $translatePartialLoaderProvider, RestangularProvider, uiSelectConfig, cfpLoadingBarProvider,
    tmhDynamicLocaleProvider, lsAppConfig) {
    var debug = document.cookie.linshareDebug || lsAppConfig.debug;
    $logProvider.debugEnabled(debug);

    $translateProvider.useLoader('$translatePartialLoader', {urlTemplate: 'i18n/{part}-{lang}.json'});

    $translatePartialLoaderProvider.addPart('locale');

    $translateProvider.preferredLanguage('en');
    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    if(debug) {
      $translateProvider.useMissingTranslationHandlerLog();
    }
    $translateProvider.useCookieStorage();
    // $translateProvider.useMissingTranslationHandler('myCustomHandlerFactory');

    tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular/angular-locale_{{locale}}.js');

    RestangularProvider.setBaseUrl(lsAppConfig.backendURL);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
    RestangularProvider.addResponseInterceptor(function(data, operation) {
      // on succes from head request, the new response is true
      if(operation === 'head' ) {
        return true;
      }
      var newResponse = data;
      if (angular.isArray(data)) {
        angular.forEach(newResponse, function(value, key) {
          if (angular.isObject(value)) {
            newResponse[key].originalElement = angular.copy(value);
          }else{
            newResponse.originalElement = [];
            newResponse.originalElement[key] = angular.copy(value);
          }

        });
      } else if (angular.isObject(data)){
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

    // Force reloading controller (https://github.com/angular-ui/ui-router/issues/582)
    $provide.decorator('$state', ['$delegate', '$rootScope', function($delegate, $rootScope) {
      $delegate.reinit = function() {
        this.go('.', {}, {reload: true});
      };
      $rootScope.$on('$stateChangeStart', function(event, state, params) {
        $delegate.next = state;
        $delegate.toParams = params;
      });
      return $delegate;
    }]);
}])

// Register work which should be performed when the injector is done loading all modules
.run(['$rootScope', '$state', '$log', 'Restangular', 'Notification', 'lsAppConfig',
  function($rootScope, $state, $log, Restangular, Notification, lsAppConfig) {
    Restangular.setErrorInterceptor(function(response, deferred) {
        if (response.config.method === 'HEAD' && response.status === 404) {
          deferred.resolve(false);
          return false;
        }
        $log.error(response);
        if (response.status !== 401 && response.status < 500) {
          Notification.addError(response.data);
        }
        if (response.status >= 500 && response.status < 600) {
          Notification.addError(response);
        }
        return true;
      }
    );
    if (lsAppConfig.debug) {
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams){
        $log.debug('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',
          toState, toParams);
      });
      $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        $log.debug('$stateChangeError - fired when an error occurs during transition.');
        $log.debug([event, toState, toParams, fromState, fromParams].join('\n'));
        $log.debug(arguments);
      });
      $rootScope.$on('$stateChangeSuccess',function(event, toState){
        $log.debug('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
      });
      // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
      //   // runs on individual scopes, so putting it in "run" doesn't work.
      //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
      // });
      $rootScope.$on('$viewContentLoaded',function(event){
        $log.debug('$viewContentLoaded - fired after dom rendered',event);
      });
      $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        $log.debug('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        $log.debug(unfoundState, fromState, fromParams);
      });
    }
    $rootScope.routerState = $state;
  }
]);
