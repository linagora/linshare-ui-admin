'use strict';

angular.module('linshareAdminApp')
  .controller('MailActivationCtrl',
    ['$scope', '$state', '$timeout', 'MailActivation',
    function($scope, $state, $timeout, MailActivation) {
      var timeoutId = undefined;
      var setIcon = function (value) {
        if ($scope.mailActivation.parentIdentifier == null)
          $scope.iconSaved = value;
        else
          $scope.$parent.$parent.$parent.iconSaved = value;
      };
      $scope.displayIconSaved = function() {
        setIcon(true);
        $timeout(function() {
          setIcon(false);
        }, 800);
      };
      // HELPER FUNCTION
      $scope.showActivation = function() {
        return $scope.mailActivation.activationPolicy.parentAllowUpdate;
      };
      $scope.showConfiguration = function() {
        return $scope.mailActivation.activationPolicy.policy != 'FORBIDDEN'
                && $scope.mailActivation.configurationPolicy.parentAllowUpdate;
      };
      $scope.showDelegation = function() {
        return $scope.mailActivation.activationPolicy.policy != 'FORBIDDEN'
                && $scope.mailActivation.delegationPolicy
                && $scope.mailActivation.delegationPolicy.parentAllowUpdate;
      };

      $scope.showResetToParent = function() {
        return ($scope.showDelegation() || $scope.showConfiguration() || $scope.showActivation());
      };
      $scope.disableStatus = function(policyType) {
        if (policyType) {
          return policyType.policy !== 'ALLOWED';
        }
        return false;
      };
      $scope.isRootDomain = function() {
        return $scope.mailActivation.domain === 'LinShareRootDomain';
      };
      // UPDATE FUNCTION
      var updateMailActivation = function(mailActivation) {
        MailActivation.update(mailActivation).then(function() {
          $scope.displayIconSaved();
        });
      };
      $scope.updateWithTimeout = function() {
        if (angular.isDefined(timeoutId)) {
          $timeout.cancel(timeoutId);
        }
        timeoutId = $timeout(function() {
          $scope.update();
          timeoutId = undefined;
        }, 1500);
      };
      var updateStatus = function(policyType) {
        if (policyType) {
          policyType.status = policyType.policy === 'ALLOWED' ? policyType.status : policyType.policy === 'MANDATORY';
        }
      };
      $scope.update = function() {
        updateStatus($scope.mailActivation.activationPolicy);
        updateStatus($scope.mailActivation.configurationPolicy);
        updateStatus($scope.mailActivation.delegationPolicy);

        updateMailActivation($scope.mailActivation);
      };
      $scope.resetToParent = function() {
        MailActivation.get($state.params.domainId, $scope.mailActivation.identifier).then(function(mailActivation) {
          MailActivation.remove(mailActivation).then(function() {
            $state.reinit();
            $scope.displayIconSaved();
          });
        });
      };

      $scope.checkPolicyType = function (policyType) {
        policyType.status = policyType.defaultStatus;
      };

      // FUNCTION TO SIMPLE VIEW
      $scope.changeStatusMailActivation = function(){
        updateMailActivation($scope.mailActivation);
      };
      $scope.changeDelegationMailActivation = function(){
        if ($scope.mailActivation.delegationPolicy.status == true)
          $scope.mailActivation.delegationPolicy.status = true;
        else
          $scope.mailActivation.delegationPolicy.status = false;

        $scope.mailActivation.delegationPolicy.policy = 'ALLOWED';
        updateMailActivation($scope.mailActivation);
      };
    }]
  );
