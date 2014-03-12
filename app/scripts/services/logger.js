'use strict';

/* Services */

angular.module('myApp.services')
  .provider('logger',
  function() {
    this.isDebug = false;
    this.$get = ['$cookies', 'preferencesService', function($cookies, Preferences) {
      if (!angular.isDefined($cookies.linshareDebug)) {
        if (!angular.isDefined(Preferences.system.debug) && Preferences.system.debug) {
          this.isDebug = true;
        }
      }
    }];
  }
);
