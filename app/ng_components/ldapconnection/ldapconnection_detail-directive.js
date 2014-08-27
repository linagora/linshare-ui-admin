'use strict';

angular.module('linshareAdminApp').directive('lsLdapConnectionForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'LdapConnection',
        function($scope, $modal, $log, LdapConnection) {
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
                templateUrl: 'ng_components/common/confirm_modal.tpl.html',
                controller: 'ConfirmDialogCtrl',
                resolve: {
                  content: function() {
                    return 'DOMAIN_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH';
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
      templateUrl: 'ng_components/ldapconnection/ldapconnection_detail.tpl.html',
      replace: false
    };
  }
]);
