'use strict';

angular.module('linshareAdminApp').directive('lsLdapConnectionForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', '$translate', 'LdapConnection',
        function($scope, $modal, $log, $translate, LdapConnection) {
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
                templateUrl: 'views/templates/confirm_dialog.html',
                controller: 'ConfirmDialogCtrl',
                resolve: {
                  content: function() {
                    return $translate('DOMAIN_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH');
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
              $scope.ldapConnection = LdapConnection.copyCurrent();
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
      templateUrl: 'views/templates/domains/ldap_connection_form.html',
      replace: false
    };
  }
]);
