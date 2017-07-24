'use strict';

angular.module('linshareAdminApp').directive('lsFooter',
	function(lsAppConfig, $rootScope, $translate) {
		var getTemplate = function() {
      if (lsAppConfig.license) {
        // TODO : $translate.use() was not working while IAB implemented partial loaders, fix it and readd dynamic lang in url
        return 'ng_components/common/footer_en.tpl.html';
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
