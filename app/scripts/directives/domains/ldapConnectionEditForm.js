'use strict';

app.directive('lsLdapConnectionEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.confirmCollapsed = true;
        scope.hideForm = false;
      },
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'notificationService',
        function($scope, $rootScope, $log, Restangular, notificationService) {
          $scope.submit = function(ldapConnection) {
            $log.debug('ldapConnection edition: ' + ldapConnection.identifier);
            ldapConnection.put().then(function success(ldapConnections) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
              notificationService.addSuccess('P_Domains-LDAPConnections_UpdateSuccess');
            });
          };
          $scope.reset = function() {
            $scope.ldapConnection = Restangular.copy($scope.ldapConnectionToEdit);
          };
          $scope.delete = function(ldapConnection) {
            $log.debug('ldapConnection deletion: ' + ldapConnection.identifier);
            ldapConnection.remove().then(function success(ldapConnections) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
              notificationService.addSuccess('P_Domains-LDAPConnections_DeleteSuccess');
            });
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/ldap_connection_edit_form.html',
      replace: false
    };
  }
]);
