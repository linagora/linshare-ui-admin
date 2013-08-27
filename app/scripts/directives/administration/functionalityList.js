'use strict';

app.directive('lsFunctionalityList', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
          scope.showForm = false;
          scope.$on('currentDomainChanged', function() {
            if (!_.isNull(scope.currentDomain)) {
              scope.showForm = true;
            } else {
              scope.showForm = false;
            }
          });
      },
      controller: ['$scope', '$route', 'Restangular', 'localize', 'loggerService',
        function($scope, $route, Restangular, Localize, Logger) {
          var getLocalizeFunctionalityName = function(functionality) {
            return Localize.getLocalizedString('P_Administration-Functionalities_Func-' + functionality.identifier);
          };
          $scope.functionalities = [];
          $scope.$on('currentDomainChanged', function() {
            if (!_.isNull($scope.currentDomain)) {
              // Save the previous state
              Restangular.all('domains').all($scope.currentDomain.identifier).all('functionalities').getList().then(
                function success(functionalities) {
                  angular.forEach(functionalities, function(functionality) {
                    functionality.name = getLocalizeFunctionalityName(functionality);
                  });
                  $scope.functionalities = functionalities;
                }  
              );
            }
          });
        }
      ],
      templateUrl: '/views/templates/administration/functionality_list.html',
      replace: false
    };
  }
]);
