'use strict';

app.directive('lsFooter', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      templateUrl: '/views/templates/style/footer.html',
      replace: false
    };
  }
]);
