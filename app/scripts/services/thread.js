'use strict';

/* Services */

angular.module('myApp.services')
  .factory('threadService', ['$resource', 'preferencesService',
  function($resource, Preferences) {
    return $resource(Preferences.system.linshareURL + '/webservice/rest/threads/:threadId.json', {}, {
      query: {
        method: 'GET',
        params: {
          threadId: 'list'
        },
        isArray: true
      }
    });
  }
]);
