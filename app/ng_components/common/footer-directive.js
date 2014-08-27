'use strict';

angular.module('linshareAdminApp').directive('lsFooter', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      templateUrl: 'ng_components/common/footer.tpl.html',
      replace: false
    };
  }
]);
