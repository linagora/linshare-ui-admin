'use strict';

angular.module('linshareUiAdmin').directive('lsAlertTimeout', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.fadeTo(500, 0).slideUp(500, function(){
            element.children().click();
          });
        }, 4000);
      },
      replace: false
    };
  }
]);
