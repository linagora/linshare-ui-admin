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
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService',
        function($scope, $rootScope, Restangular, Logger) {
          $scope.submit = function(ldapConnection) {
            Logger.debug('ldapConnection edition :' + ldapConnection.identifier);
            ldapConnection.put().then(function success(ldapConnections) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
            }, function error() {
              Logger.error('Unable to update the ldapConnection : ' + ldapConnection.identifier);
            });
          };
          $scope.reset = function() {
            $scope.ldapConnection = Restangular.copy($scope.ldapConnectionToEdit);
          };
          $scope.delete = function(ldapConnection) {
            Logger.debug('ldapConnection deletion : ' + ldapConnection.identifier);
            ldapConnection.remove().then(function success(ldapConnections) {
              $rootScope.$broadcast('reloadList');
              $scope.hideForm = true;
            }, function error() {
              Logger.error('Unable to delete the ldapConnection : ' + ldapConnection.identifier);
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
