/**
 * lsLogo Directive
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .directive('lsLogo', lsLogo);

  lsLogo.$inject = ['lsAppConfig'];

  /**
   * @namespace lsLogo
   * @desc Logo for administration navbar
   * @example <a href="index.html" class="ls-logo">
   * @memberOf linshareAdminApp
   */
  function lsLogo(lsAppConfig) {
    var directive = {
      restrict: 'C',
      templateUrl: 'ng_components/common/logo.tpl.html',
      link: linkFn
    };

    return directive;

    /**
     *  @name linkFn
     *  @desc DOM manipulation function, relared to the directive
     *  @param {Object} scope - Angular scope object of the directive
     *  @memberOf linshareAdminApp.lsLogo
     */
    function linkFn(scope) {
      scope.lsAppConfig = lsAppConfig;
      scope.customLogo = false;
      if (!lsAppConfig.license && lsAppConfig.logoURL) {
        scope.customLogo = true;
      }
    }
  }
})();
