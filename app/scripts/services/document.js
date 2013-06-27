'use strict';

/* Services */

angular.module('myApp.services')
  .factory('documentService', ['$resource', 'preferencesService',
  function($resource, Preferences) {
    return $resource(Preferences.system.linshareURL + '/webservice/rest/documents/:documentId.json', {}, {
      query: {
        method: 'GET',
        params: {
          documentId: 'list'
        },
        isArray: true
      }
    });
  }
]);
