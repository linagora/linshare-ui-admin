'use strict';

app.directive('lsFunctionalityEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.showConfiguration = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' 
                  && functionality.configurationPolicy.parentAllowUpdate;
        };
        scope.disableStatus = function(policyType) {
          if (policyType.policy === 'FORBIDDEN' || policyType.policy === 'MANDATORY') {
            return true;
          } else {
            return false;
          }
        };
        scope.updateStatus = function(policyType) {
          if (policyType.policy === 'FORBIDDEN') {
            policyType.status = false;
            return false;
          } else if (policyType.policy === 'MANDATORY') {
            policyType.status = true;
            return true;
          } else { // ALLOWED
            return policyType.status;
          }
        };
        scope.paramChanges = function(paramaters) {

        };
      },
      controller: ['$scope', '$timeout', 'Restangular', 'localize', 'loggerService',
        function($scope, $timeout, Restangular, Localize, Logger) {
          var getLocalizeFunctionalityName = function(functionality) {
            return Localize.getLocalizedString('P_Administration-Functionalities_Func-' + functionality.identifier);
          };
          var saved = false;
          var submitting = false;
          var timeoutId = null;
          $scope.reset = function(functionality) {
            var domain = functionality.domain;
            var identifier = functionality.identifier;
            functionality.remove().then(function success() {
              Restangular.all('domains').all(domain).one('functionalities', identifier).get().then(function success(f) {
                $scope.functionality = f;
                $scope.functionality.name = getLocalizeFunctionalityName(functionality);
              });
            });
          };
          $scope.getSaved = function() {
            var string = ''
            if (saved) {
              string = Localize.getLocalizedString('P_Administration-Functionalities_Saved');
              $timeout(function() {
                saved = false;
              }, 2000);
            }
            return string;
          };
          $scope.updateWithTimeout = function(functionality) {
            if (submitting) {
              $timeout.cancel(timeoutId);
            } else {
              submitting = true;
            }
            timeoutId = $timeout(function() {
              $scope.update(functionality);
              submitting = false;
            }, 1500);
          }
          $scope.update = function(functionality) {
            functionality.put().then(function success() {
              Logger.debug(functionality.identifier + ' updated');
              saved = true;
            });
          };
        }
      ],
      templateUrl: '/views/templates/administration/functionality_edit_form.html',
      replace: false
    };
  }
]);
