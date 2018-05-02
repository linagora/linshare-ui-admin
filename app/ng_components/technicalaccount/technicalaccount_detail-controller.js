'use strict';

angular.module('linshareAdminApp')
  .controller('TechnicalAccountDetailCtrl', [
    '$log', 
    '$modal',
    '$scope',
    '$state',
    'Password',
    'TechnicalAccount', 
    'currentTechnicalAccount',
    'lsAppConfig',
    'selectOptions',
    function(
      $log,
      $modal, 
      $scope,
      $state,
      Password, 
      TechnicalAccount, 
      currentTechnicalAccount,
      lsAppConfig,
      selectOptions
    ) { 
      getRoles();

      $scope.state = $state.params.formState;
      $scope.account = currentTechnicalAccount || {};
      $scope.permissionTypes = selectOptions.permissionTypes;
      if ($scope.state === 'create') {
        $scope.account.password = '';
      }

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
      };
      $scope.changePassword = function() {
        TechnicalAccount.changePassword($scope.account.uuid, $scope.password);
      };
      $scope.submit = function() {
        if ($scope.state === 'edit') {
          TechnicalAccount.update($scope.account);
        } else if ($scope.state === 'create') {
          TechnicalAccount.add($scope.account).then(function() {
            $state.go('technicalaccount.list');
          });
        } else {
          $log.error('Invalid state');
        }
      };
      $scope.remove = function() {
        if ($scope.state !== 'edit') {
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
            TechnicalAccount.remove($scope.account).then(function() {
              $state.go('technicalaccount.list');
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.reset = function() {
        $state.reinit();
      };
      
      function getRoles() {
        var initialRoles = ['DELEGATION', 'UPLOAD_PROPOSITION'];

        TechnicalAccount.getHeaders().then(function(headers) {
          var linshareSafeModeCastedToBoolean = Boolean(headers['x-linshare-safe-mode']);

          if (linshareSafeModeCastedToBoolean) {
            initialRoles.push('SAFE');
          }

          $scope.rolesList = initialRoles;
        });
      }
    }]
  );

