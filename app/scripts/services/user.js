'use strict';

/* Services */

angular.module('myApp.services')
  .factory('userService', ['$resource', 'preferencesService',
  function($resource, Preferences) {
    return $resource(Preferences.system.linshareURL + '/webservice/rest/users/:userId.json', {}, {
      query: {
        method: 'GET',
        params: {
          userId: 'list'
        },
        isArray: true
      }
    });
  }
]);
