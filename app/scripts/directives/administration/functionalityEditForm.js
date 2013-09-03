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
      },
      controller: ['$scope', '$route', 'Restangular', 'localize', 'loggerService',
        function($scope, $route, Restangular, Localize, Logger) {
          var getLocalizeFunctionalityName = function(functionality) {
            return Localize.getLocalizedString('P_Administration-Functionalities_Func-' + functionality.identifier);
          };
          $scope.reset = function(functionality) {
            var domain = functionality.domain;
            var identifier = functionality.identifier;
            console.log(functionality);
            functionality.remove().then(function success() {
              Restangular.all('domains').all(domain).all('functionalities').one(identifier).get().then(function success(f) {
                $scope.functionality = f;
                $scope.functionality.name = getLocalizeFunctionalityName(functionality);
              });
            });
          };
          $scope.update = function(functionality) {
            functionality.put().then(function success(){
              Logger.debug(functionality.identifier + ' updated');
            });
          };
        }
      ],
      templateUrl: '/views/templates/administration/functionality_edit_form.html',
      replace: false
    };
  }
]);
