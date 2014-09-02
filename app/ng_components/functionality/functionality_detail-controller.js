'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityDetailCtrl',
    ['$scope', '$timeout', '$log', '$state', 'Functionality', 'currentDomain', 'currentFunctionality',
    function($scope, $timeout, $log, $state, Functionality, currentDomain, currentFunctionality) {
        $scope.functionality = currentFunctionality;
        $scope.domain = currentDomain;
        $scope.iconSaved = false;
        var timeoutId = undefined;
        var updateStatus = function(policyType) {
          if (policyType) {
            policyType.status = policyType.policy === 'ALLOWED' ? policyType.status : policyType.policy === 'MANDATORY';
          }
        };

        $scope.showActivation = function(functionality) {
          return functionality.activationPolicy.parentAllowUpdate;
        };
        $scope.showConfiguration = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && functionality.configurationPolicy.parentAllowUpdate;
        };
        $scope.showDelegation = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && functionality.delegationPolicy
                  && functionality.delegationPolicy.parentAllowUpdate;
        };
        $scope.showParameters = function(functionality) {
          return functionality.parentAllowParametersUpdate;
        };
        $scope.disableStatus = function(policyType) {
          if (policyType) {
            return policyType.policy !== 'ALLOWED';
          }
          return false;
        };
        $scope.checkPolicyType = function (policyType) {
          policyType.status = policyType.defaultStatus;
        };
        $scope.isRootDomain = function() {
          return $scope.functionality.domain.type === 'ROOTDOMAIN';
        };
        $scope.displayIconSaved = function() {
          $scope.iconSaved = true;
          $timeout(function() {
            $scope.iconSaved = false;
          }, 800);
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
        $scope.update = function() {
          updateStatus($scope.functionality.activationPolicy);
          updateStatus($scope.functionality.configurationPolicy);
          updateStatus($scope.functionality.delegationPolicy);
          Functionality.update($scope.functionality,
            function successCallback(updatedFunc) {
              $scope.displayIconSaved();
            }
          );
        };
        $scope.resetToParent = function() {
          Functionality.remove($scope.functionality, function() {
            $state.reinit();
            $scope.displayIconSaved();
          });
        };
        $scope.cancel = function() {
          $state.go('functionality.list', {domainId: $scope.functionality.domain});
        };
    }]
  );
