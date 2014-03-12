'use strict';

app.directive('lsLdapConnectionCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'notificationService',
        function($scope, $rootScope, $log, Restangular, notificationService) {
          $scope.submit = function(ldapConnection) {
            $log.debug('ldapConnection creation: ' + ldapConnection.identifier);
            Restangular.all('ldap_connections').post(ldapConnection).then(function success(ldapConnections) {
              $rootScope.$broadcast('reloadList');
              $rootScope.$broadcast('showList');
              $scope.reset();
              notificationService.addSuccess('P_Domains-LDAPConnections_CreateSuccess');
            });
          };
          $scope.reset = function() {
            $scope.ldapConnection = {};
          };
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/ldap_connection_create_form.html',
      replace: false
    };
  }
]);
