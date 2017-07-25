/**
 * graphArea Directive
 * @namespace graphArea
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphArea', graphArea);

  graphArea.$inject = [];

  /**
   * @namespace graphArea
   * @desc Graph component managing area element (or sub-container) to details a sub-element of a container
   * @example <div class="inner-sub-ctn" data-ng-if="container.areas" data-ng-repeat="area in container.areas"
   *               data-ng-class="area.colors.main" graph-area="area">
   *          </div>
   * @memberOf graphApp
   */
  function graphArea() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-container/graph-area/graph-area-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphArea - Area object
         * @param {string} graphArea.tooltip - Translation key or sentence to be shown on area hover
         * @param {string} graphArea.label - Translation key or sentence to be shown inside the area
         * @param {Object|number|function} graphArea.value - Value to be shown inside the area and
                                                             also used for calculation of element width
         * @param {string|function} [graphArea.value.display] - Value to be shown inside the area
         * @param {number|function} [graphArea.value.real] - Value used for calculation of element width
         * @param {boolean} [graphArea.disabled] - Determine if the element should be disabled hence not showed
         */
        area: '=graphArea'
      },
      link: linkFn
    };
    return directive;

    ////////////

    /**
     * @name linkFn
     * @desc link function of the directive
     * @param {Object} scope - Angular scope object of the directive
     * @param {Object} elm - jqLite-wrapped element that this directive matches
     * @memberOf graphApp.graphArea
     */
    function linkFn(scope, elm) {
      var area = scope.area;
      elm.css('flex', '0 0 ' + area.width + '%');
      area.display = area.width < 2 ? false : area.display;
    }
  }
})();
