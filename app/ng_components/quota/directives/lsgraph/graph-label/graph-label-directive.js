/**
 * graphLabel Directive
 * @namespace graphLabel
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphLabel', graphLabel);

  graphLabel.$inject = [];

  /**
   * @namespace graphLabel
   * @desc Graph component managing ruler label element to be shown below the graph
   * @example <p data-ng-repeat="label in graph.labels" data-ng-if="!label.disabled" graph-label="label"></p>
   * @memberOf graphApp
   */
  function graphLabel() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-label/graph-label-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphLabel - Label object
         * @param {string} graphLabel.value - Value to be shown
         * @param {boolean} [graphLabel.disabled] - Determine if the element should be disabled hence not showed
         */
        label: '=graphLabel'
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
     * @memberOf graphApp.graphLabel
     */
    function linkFn(scope, elm) {
      var label = scope.label;
      if (!label) {
        return;
      }

      elm.css('left', label.position + '%');
    }
  }
})();
