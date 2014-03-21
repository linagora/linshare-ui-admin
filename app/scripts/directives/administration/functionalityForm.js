'use strict';

app.directive('lsFunctionalityForm', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.showActivation = function() {
          return scope.functionality.activationPolicy.parentAllowUpdate;
        };
        scope.showConfiguration = function() {
          return scope.functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && scope.functionality.configurationPolicy.parentAllowUpdate;
        };
        scope.disableStatus = function(policyType) {
          return policyType.policy === 'FORBIDDEN' || policyType.policy === 'MANDATORY';
        };
        scope.spinner = false;
      },
      controller: ['$scope', '$timeout', '$log', 'Domain', 'Functionality',
        function($scope, $timeout, $log, Domain, Functionality) {
          var timeoutId = undefined;
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
              $scope.update($scope.functionality);
              timeoutId = undefined;
            }, 1500);
          };
          $scope.update = function() {
            Functionality.update($scope.functionality,
              function successCallback(functionality) {
                $scope.spinner = true;
                Functionality.get($scope.domain , functionality.identifier,
                  function successCallback(functionality) {
                    Functionality.setCurrent(functionality);
                    $scope.spinner = false;
                  }
                );
              }
            );
          };
          $scope.resetToParent = function() {
            Functionality.remove($scope.functionality,
              function successCallback(functionality) {
                $scope.spinner = true;
                Functionality.get($scope.domain , functionality.identifier,
                  function successCallback(functionality) {
                    Functionality.setCurrent(functionality);
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
                  $scope.update();
                  Functionality.setCurrent(undefined);
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
