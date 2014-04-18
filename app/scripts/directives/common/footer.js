'use strict';

angular.module('linshareAdminApp').directive('lsFooter', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      templateUrl: '/views/templates/common/footer.html',
      replace: false
    };
  }
]);
