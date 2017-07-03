'use strict';

angular.module('linshareAdminApp').directive('lsAlertTimeout', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var time = (attrs.type === 'success') ? 4000 : 8000;
        if (attrs.type === 'success') {
          $timeout(function() {
            element.fadeTo(500, 0).slideUp(500, function(){
              element.children().click();
            });
          }, time);
        } else {
          $timeout(function() {
            element.fadeTo(1, 0.7);
          }, time);
        }
      },
      replace: false
    };
  }
]);
