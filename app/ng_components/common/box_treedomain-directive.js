'use strict';

angular.module('linshareAdminApp').directive('boxTreeDomain', ['$window',
  function($window) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var bodyHeight = ($window.innerHeight - 250);
        element.css('height', ( bodyHeight > 400 ) ? bodyHeight : 400);
      }
    };
  }
]);