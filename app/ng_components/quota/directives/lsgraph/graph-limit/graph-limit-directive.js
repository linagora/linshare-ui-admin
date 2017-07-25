/**
 * graphLimit Directive
 * @namespace graphLimit
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphLimit', graphLimit);

  graphLimit.$inject = [];

  /**
   * @namespace graphLimit
   * @desc Graph component managing limit to be show above the graph
   * @example <div data-ng-if="graph.limit" graph-limit="graph.limit"></div>
   * @memberOf graphApp
   */
  function graphLimit() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-limit/graph-limit-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphLimit - Limit object
         * @param {string|function} graphLimit.value - Value to be shown as an indicator on the ruler
         * @param {Object} [graphLimit.label] - Label to be shown on the highlighted area on the ruler
         * @param {string} [graphLimit.label.middle] - Label to be shown on the middle of the highlighted
         * @param {string} [graphLimit.label.max] - Label to be shown on the max of the highlighted
         */
        limit: '=graphLimit'
      }
    };
    return directive;
  }
})();
