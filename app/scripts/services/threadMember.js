'use strict';

/* Services */

angular.module('myApp.services')
  .factory('threadMemberService', ['$resource', 'preferencesService',
  function($resource, Preferences) {
    return $resource(Preferences.system.linshareURL + '/webservice/rest/threads/members/:threadMemberId/:threadId.json', {}, {
      query: {
        method: 'GET',
        params: {
          threadMemberId: 'list'
        },
        isArray: true
      }
    });
  }
]);
