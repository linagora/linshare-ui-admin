'use strict';

app.directive('lsFunctionalityForm', [
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
        scope.disableStatus = function(policyType) {
          return policyType.policy !== 'ALLOWED';
        };
        scope.spinner = false;
      },
      controller: ['$scope', '$timeout', '$log', 'Domain', 'Functionality',
        function($scope, $timeout, $log, Domain, Functionality) {
          var timeoutId = undefined;
          var updateStatus = function(policyType) {
            policyType.status = policyType.policy === 'ALLOWED' ? policyType.status : policyType.policy === 'MANDATORY';
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
            $scope.spinner = true;
            updateStatus($scope.functionality.activationPolicy);
            updateStatus($scope.functionality.configurationPolicy);
            Functionality.update($scope.functionality,
              function successCallback(updatedFunc) {
                $scope.spinner = false;
              }
            );
          };
          $scope.resetToParent = function() {
            $scope.spinner = true;
            Functionality.remove($scope.functionality,
              function successCallback(deletedFunc) {
                Functionality.get($scope.domain , deletedFunc.identifier,
                  function successCallback(parentFunc) {
                    Functionality.setCurrent(parentFunc);
                    $scope.spinner = false;
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
                      Functionality.setCurrent(undefined);
                    }
                  );
                }
                $scope.domain = Domain.getCurrent();
              }
            }
          );
          $scope.isRootDomain = function() {
            return $scope.domain.type === 'ROOTDOMAIN';
          };
        }
      ],
      templateUrl: '/views/templates/administration/functionality_form.html',
      replace: false
    };
  }
]);
