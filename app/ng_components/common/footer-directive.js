'use strict';

angular.module('linshareAdminApp').directive('lsFooter',
  ['lsAppConfig',
	function(lsAppConfig) {
		return {
			restrict: 'A',
			transclude: true,
			scope: false,
			templateUrl: (lsAppConfig.license) ? 'ng_components/common/footer.tpl.html' : '',
			replace: false
		};
	}
	]);
