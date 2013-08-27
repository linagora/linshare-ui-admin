'use strict';

app.directive('lsFunctionalityEditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
      },
      controller: ['$scope', '$route', 'Restangular', 'localize', 'loggerService',
        function($scope, $route, Restangular, Localize, Logger) {
          $scope.parentActivationIsAllowed = function(functionality) {
            /*var isAllowed = false;
            Restangular.all('domains').all($scope.currentDomain.parent).all('functionality')
              .one($scope.functionality.identifier).get().then(
              function success(functionality) {
                if (functionality.activation.value === 1) {
                  isAllowed = true;
                }
              }
            );
            return isAllowed;*/
            return true;
          };
          $scope.parentConfigurationIsAllowed = function(functionality) {
            /*var isAllowed = false;
            Restangular.all('domains').all($scope.currentDomain.parent).all('functionality')
              .one($scope.functionality.identifier).get().then(
              function success(functionality) {
                if (functionality.configuration.value === 1) {
                  isAllowed = true;
                }
              }
            );
            return isAllowed;*/
            return true;
          };
        }
      ],
      templateUrl: '/views/templates/administration/functionality_edit_form.html',
      replace: false
    };
  }
]);
