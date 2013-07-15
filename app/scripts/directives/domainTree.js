'use strict';

app.directive('linshareDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      controller: ['$scope', 'loggerService',
        function($scope, Logger) {
          $scope.displayConfig = false;
          $scope.configDomain = function(domain) {
            if ($scope.currentDomain === domain) {
              $scope.displayConfig = false;
              $scope.currentDomain = null;
            } else {
              $scope.displayConfig = true;
              $scope.currentDomain = domain;
            }
          } 
        }
      ],
      templateUrl: '/views/templates/domain_tree.html',
      replace: false
    };
  }
]);
