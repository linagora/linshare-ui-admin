'use strict';

angular.module('linshareAdminApp').directive('lsFooter',
	function(lsAppConfig, $rootScope) {
		var getTemplate = function() {
      if (lsAppConfig.license) {
        // TODO : $translate.use() was not working while IAN implemented partial loaders, fix it and re-add
        // 'ng_components/common/footer_' + $translate.use() + '.tpl.html'
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
