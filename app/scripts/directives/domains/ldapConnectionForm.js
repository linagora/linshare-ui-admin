'use strict';

app.directive('lsLdapConnectionForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'Restangular', 'LdapConnection', 'localize',
        function($scope, $modal, $log, Restangular, LdapConnection, localize) {
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              LdapConnection.update(
                $scope.ldapConnection,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else if ($scope.state === 'create') {
              LdapConnection.add(
                $scope.ldapConnection,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else {
              $log.error('Invalid state');
            }
          };
          $scope.remove = function() {
            if ($scope.state === 'edit') {
              var modalInstance = $modal.open({
                templateUrl: '/views/templates/confirm_dialog.html',
                controller: 'ConfirmDialogCtrl',
                resolve: {
                  content: function() {
                    return localize.getLocalizedString(
                      'P_Domains-LDAPConnections_ConfirmDeleteText'
                    );
                  }
                }
              });
              modalInstance.result.then(
                function validate() {
                  LdapConnection.remove(
                    $scope.ldapConnection,
                    function successCallback() {
                      $scope.cancel();
                    }
                  );
                }, function cancel() {
                  $log.debug('Deletion modal dismissed');
                }
              );
            } else {
              $log.error('Invalid state');
            }
          };
          $scope.cancel = function() {
            LdapConnection.setCurrent(undefined);
          };
          $scope.reset = function() {
            if (LdapConnection.currentIsDefined()) {
              $scope.ldapConnection = Restangular.copy(LdapConnection.getCurrent());
              if (_.isEmpty(LdapConnection.getCurrent())) {
                $scope.state = 'create';
              } else {
                $scope.state = 'edit';
              }
            }
          };
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/ldap_connection_form.html',
      replace: false
    };
  }
]);
