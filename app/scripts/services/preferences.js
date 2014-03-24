'use strict';

/* Services */

function Preferences(settings) {
  this.system = settings;
};

angular.module('myApp.services')
  .provider('preferencesService',
  function PreferencesServiceProvider() {
    var settings = {};
    this.loadSettings = function() {
      var url = '/system-preferences.json';
      var request = new XMLHttpRequest();
      request.open('GET', url, false);
      request.send(null);
      if (request.status !== 200) {
        console.error('No system preferences file');
      }
      settings = JSON.parse(request.responseText);
      return settings;
    };
    this.$get = [function preferencesServiceFactory() {
      return new Preferences(settings);
    }];
  }
);
