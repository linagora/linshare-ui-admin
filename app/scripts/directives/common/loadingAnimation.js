'use strict';

app.directive('linshareLoadingAnimation', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      templateUrl: '/views/templates/common/loading_animation.html',
      replace: false
    };
  }
]);
