'use strict';

angular.module('linshareAdminApp').directive('lsFooter',
	function(lsAppConfig, $rootScope, $translate) {
		var getTemplate = function() {
      if (lsAppConfig.license) {
        return 'ng_components/common/footer_' + $translate.use() + '.tpl.html';
      }
	  };
    var linker = function(scope) {
			scope.template = getTemplate();
			$rootScope.$on('$translateChangeSuccess', function() {
        scope.template = getTemplate();
      });
		};
		return {
			restrict: 'A',
			transclude: true,
			scope: false,
			link: linker,
			templateUrl: (lsAppConfig.license) ? 'ng_components/common/footer.tpl.html' : '',
			replace: false
		};
});
