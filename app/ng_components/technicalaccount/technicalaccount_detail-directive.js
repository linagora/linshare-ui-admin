'use strict';

angular.module('linshareAdminApp').directive('lsTechnicalAccountForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'Enum', 'Password', 'TechnicalAccount',
        function($scope, $modal, $log, Enum, Password, TechnicalAccount) {
          $scope.tmp = {
            'newPwdRetyped1': '',
            'newPwdRetyped2': ''
          };
          $scope.password = {
            'oldPwd' : '',
            'newPwd' : ''
          };
          $scope.strengthScore = function(password) {
            return Password.strengthScore(password);
          };
          $scope.match = function(a, b) {
            return Password.match(a, b);
          }

          Enum.getOptions('technical_account_permission_type', function successCallback(permissionTypes) {
            $scope.permissionTypes = permissionTypes;
          });
          $scope.changePassword = function() {
            TechnicalAccount.changePassword($scope.account.uuid, $scope.password);
          };
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              TechnicalAccount.update(
                $scope.account,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else if ($scope.state === 'create') {
              TechnicalAccount.add(
                $scope.account,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else {
              $log.error('Invalid state');
            }
          };
          $scope.remove = function() {
            if ($scope.state != 'edit') {
              $log.error('Invalid state');
            }
            var modalInstance = $modal.open({
              templateUrl: 'ng_components/common/confirm_modal.tpl.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return 'TECHNICAL_ACCOUNT.CONFIRM_DELETE_FORM.PARAGRAPH';
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                TechnicalAccount.remove(
                  $scope.account,
                  function successCallback() {
                    $scope.cancel();
                  }
                );
              }, function cancel() {
                $log.debug('Deletion modal dismissed');
              }
            );
          };
          $scope.cancel = function() {
            TechnicalAccount.setCurrent(undefined);
          };
          $scope.reset = function() {
            if (TechnicalAccount.currentIsDefined()) {
              $scope.account = TechnicalAccount.copyCurrent();
              if (_.isEmpty(TechnicalAccount.getCurrent())) {
                $scope.state = 'create';
                $scope.account.password = '';
              } else {
                $scope.state = 'edit';
              }
            }
          };
          $scope.reset();
        }
      ],
      templateUrl: 'ng_components/technicalaccount/technicalaccount_detail.tpl.html',
      replace: false
    };
  }
]);
