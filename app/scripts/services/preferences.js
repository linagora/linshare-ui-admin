'use strict';

/* Services */

angular.module('myApp.services')
  .factory('preferencesService', ['$cookies',
  function($cookies) {
    var Preferences = {
      system: {},

      load: function() {
        var url = '/system-preferences.json';
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
          console.error('No system preferences file');
        }
        Preferences.system = JSON.parse(request.responseText);
      }
    };
    return Preferences;
  }
]);
