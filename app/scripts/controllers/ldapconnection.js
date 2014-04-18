'use strict';

angular.module('linshareAdminApp')
  .controller('LdapConnectionCtrl',
    ['$scope', '$log', 'LdapConnection',
      function ($scope, $log, LdapConnection) {
        $scope.getCurrentLdapConnection = function() {
          return LdapConnection.getCurrent();
        };
      }
    ]
  );
