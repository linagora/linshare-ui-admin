/**
 * graphLegends Directive
 * @namespace graphLegends
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphLegends', graphLegends);

  graphLegends.$inject = [];

  /**
   * @namespace graphLegends
   * @desc Graph component managing legends to be show above the graph
   * @example <div data-ng-if="graph.legends" graph-legends="graph.legends"></div>
   * @memberOf graphApp
   */
  function graphLegends() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-legends/graph-legends-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object[]} graphLegends - Array of legend object
         * @param {Object[]} graphLegends[].value - Translation key or sentence to be shown above the graph as a legend
         * @param {Object[]} [graphLegends[].param] - Parameter given to a translation key if provided,
         *                                            refer to angular-translate
         * @param {boolean} [graphLegends[].disabled] - Determine if the element should be disabled hence not showed
         */
        legends: '=graphLegends'
      }
    };
    return directive;
  }
})();
