'use strict';

app.directive('linshareFooter', [
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
