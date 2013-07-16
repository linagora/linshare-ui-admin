'use strict';

app.directive('linshareDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attrs) {
        scope.editForm = false;
        scope.configDomain = function(domain) {
          if (scope.currentDomain === domain) {
            scope.editForm = false;
            scope.currentDomain = null;
          } else {
            scope.editForm = true;
            scope.currentDomain = domain;
          }
        }
      },
      templateUrl: '/views/templates/domain_tree.html',
      replace: false
    };
  }
]);
