'use strict';

angular.module('linshareAdminApp').directive('lsFunctionalityForm', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.showActivation = function(functionality) {
          return functionality.activationPolicy.parentAllowUpdate;
        };
        scope.showConfiguration = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && functionality.configurationPolicy.parentAllowUpdate;
        };
        scope.showDelegation = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && functionality.delegationPolicy
                  && functionality.delegationPolicy.parentAllowUpdate;
        };
        scope.showParameters = function(functionality) {
          return functionality.parentAllowParametersUpdate;
        };
        scope.disableStatus = function(policyType) {
          if (policyType) {
            return policyType.policy !== 'ALLOWED';
          }
          return false;
        };
        scope.iconSaved = false;
      },
      controller: ['$scope', '$timeout', '$log', 'Domain', 'Functionality',
        function($scope, $timeout, $log, Domain, Functionality) {
          var timeoutId = undefined;
          var updateStatus = function(policyType) {
            if (policyType) {
              policyType.status = policyType.policy === 'ALLOWED' ? policyType.status : policyType.policy === 'MANDATORY';
            }
          };

          $scope.checkPolicyType = function (policyType) {
            policyType.status = policyType.defaultStatus;
          }
          $scope.$watch(Functionality.getCurrent,
            function successCallback(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.functionality = newValue;
              }
            }
          );
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
            Functionality.remove($scope.functionality,
              function successCallback(deletedFunc) {
                Functionality.get(Domain.getCurrentId(), Functionality.getId(deletedFunc),
                  function successCallback(parentFunc) {
                    Functionality.setCurrent(parentFunc);
                    $scope.displayIconSaved();
                  }
                );
              }
            );
          };

          $scope.$watch(Domain.getLastAccess,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                if (angular.isDefined($scope.domain)) {
                  Functionality.update($scope.functionality,
                    function successCallback(functionality) {
                      $scope.cancel();
                    }
                  );
                }
                $scope.domain = Domain.getCurrent();
              }
            }
          );
          $scope.cancel = function() {
            Functionality.setCurrent(undefined);
          };
          $scope.isRootDomain = function() {
            return $scope.domain.type === 'ROOTDOMAIN';
          };
        }
      ],
      templateUrl: 'views/templates/parameters/functionality_form.html',
      replace: false
    };
  }
]);
