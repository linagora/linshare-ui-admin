'use strict';

angular.module('linshareUiAdmin')
  .controller('LdapConnectionCtrl',
    ['$scope', '$log', 'LdapConnection',
      function ($scope, $log, LdapConnection) {
        $scope.getCurrentLdapConnection = function() {
          return LdapConnection.getCurrent();
        };
      }
    ]
  );
