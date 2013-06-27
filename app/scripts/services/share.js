'use strict';

/* Services */

angular.module('myApp.services')
  .factory('shareService', ['$resource', 'preferencesService',
  function($resource, Preferences) {
    return $resource(Preferences.system.linshareURL + '/webservice/rest/shares/:documentId.json', {}, {
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
