'use strict';

app.directive('lsFunctionalityEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
        scope.showConfiguration = function(functionality) {
          return functionality.activationPolicy.policy != 'FORBIDDEN' && functionality.configurationPolicy.parentAllowUpdate;
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
            return false;
          } else if (policyType.policy === 'MANDATORY') {
            return true;
          } else { // ALLOWED
            return policyType.defaultStatus;
          }
        };
      },
      controller: ['$scope', '$route', 'Restangular', 'localize', 'loggerService',
        function($scope, $route, Restangular, Localize, Logger) {
          $scope.update = function(functionality) {
            functionality.put();
          };
        }
      ],
      templateUrl: '/views/templates/administration/functionality_edit_form.html',
      replace: false
    };
  }
]);
