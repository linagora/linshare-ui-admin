'use strict';

angular.module('linshareAdminApp').directive('lsLogo', ['lsAppConfig',
  function(lsAppConfig) {
  	var linker = function(scope, element) {
  		// the original logo
  		var img = 'images/linshare-logo-white.png';
  		// check license
  		if (!lsAppConfig.license && lsAppConfig.logoURL) {
  			img = lsAppConfig.logoURL;
  		}
  		element.append('<img src="' + img + '" alt="logo" />');
  	};
    return {
      restrict: 'C',
      link: linker
    };
  }
]);
