'use strict';

angular.module('linshareAdminApp').directive('boxBody', ['$window', '$state', '$rootScope',
  function($window, $state, $rootScope) {
    var getTreeDomain = function() {
      return ($state.current.views && $state.current.views.tree) ? true : false;
    };
    var setLess = function(treeDomain) {
      return (treeDomain) ? 330 : 360;
    };
    var setBodyHeight = function(element, less) {
      var bodyHeight = ($window.innerHeight - less);
      element.css('height', ( bodyHeight > 400 ) ? bodyHeight : 400);
    };
    return {
      restrict: 'C',
      scope: false,
      link: function(scope, element, attrs) {
        var less = setLess(getTreeDomain());

        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams){
          less = setLess(getTreeDomain());
          setBodyHeight(element, less);
        });

        setBodyHeight(element, less);
      },
      replace: false
    };
  }
]);