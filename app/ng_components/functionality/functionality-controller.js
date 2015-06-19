'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityCtrl',
    ['$scope', '$state', '$timeout', '$translate', 'Functionality',
    function($scope, $state, $timeout, $translate, Functionality) {
      var timeoutId = undefined;
      var setIcon = function (value) {
        if ($scope.functionality.parentIdentifier == null)
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
        return $scope.functionality.activationPolicy.parentAllowUpdate;
      };
      $scope.showConfiguration = function() {
        return $scope.functionality.activationPolicy.policy != 'FORBIDDEN'
                && $scope.functionality.configurationPolicy.parentAllowUpdate;
      };
      $scope.showDelegation = function() {
        return $scope.functionality.activationPolicy.policy != 'FORBIDDEN'
                && $scope.functionality.delegationPolicy
                && $scope.functionality.delegationPolicy.parentAllowUpdate;
      };
      $scope.showParameters = function() {
        return $scope.functionality.parentAllowParametersUpdate;
      };
      $scope.showResetToParent = function() {
        return ($scope.showParameters() || $scope.showDelegation() || $scope.showConfiguration() || $scope.showActivation());
      };
      $scope.disableStatus = function(policyType) {
        if (policyType) {
          return policyType.policy !== 'ALLOWED';
        }
        return false;
      };
      $scope.isRootDomain = function() {
        return $scope.functionality.domain === 'LinShareRootDomain';
      };
      // UPDATE FUNCTION
      var updateFunctionality = function(functionality) {
        Functionality.update(functionality).then(function() {
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
        updateStatus($scope.functionality.activationPolicy);
        updateStatus($scope.functionality.configurationPolicy);
        updateStatus($scope.functionality.delegationPolicy);

        updateFunctionality($scope.functionality);
      };
      $scope.resetToParent = function() {
        Functionality.get($state.params.domainId, $scope.functionality.identifier).then(function(functionality) {
          Functionality.remove(functionality).then(function() {
            $state.reinit();
            $scope.displayIconSaved();
          });
        });
      };

      $scope.checkPolicyType = function (policyType) {
        policyType.status = policyType.defaultStatus;
      };

      var setStatusFunctionality = function(functionality, value) {
        functionality.activationPolicy.policy = 'ALLOWED';
        functionality.activationPolicy.status = value;
        return functionality;
      };

      // FUNCTION TO SIMPLE VIEW
      var checkStatusFunctionality = function(value){
        $scope.functionality.activationPolicy.policy = 'ALLOWED';

        if ($scope.showActivation($scope.functionality))
          $scope.functionality.activationPolicy.status = value;

        if ($scope.showConfiguration($scope.functionality))
          $scope.functionality.activationPolicy.status = true;
      };
      $scope.changeStatusFunctionality = function(){
        $scope.functionality.activationPolicy.policy = 'ALLOWED';
        updateFunctionality($scope.functionality);
      };
      $scope.changeDelegationFunctionality = function(){
        if ($scope.functionality.delegationPolicy.status == true)
          $scope.functionality.delegationPolicy.status = true;
        else
          $scope.functionality.delegationPolicy.status = false;

        $scope.functionality.delegationPolicy.policy = 'ALLOWED';
        updateFunctionality($scope.functionality);
      };
    }]
  );
