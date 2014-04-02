'use strict';

angular.module('myApp.controllers')
  .controller('LdapConnectionCtrl',
    ['$scope', '$log', 'LdapConnection',
      function ($scope, $log, LdapConnection) {
        $scope.getCurrentLdapConnection = function() {
          return LdapConnection.getCurrent();
        };
      }
    ]
  );
