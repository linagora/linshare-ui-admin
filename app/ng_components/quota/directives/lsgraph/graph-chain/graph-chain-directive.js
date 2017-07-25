/**
 * graphChain Directive
 * @namespace graphChain
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphChain', graphChain);

  graphChain.$inject = [];

  /**
   * @namespace graphChain
   * @desc Graph component managing chain element (or link) to show an association with external element
   * @example <div ng-repeat="chain in graph.chains" data-ng-if="chain.position && !chain.disabled"
   *               graph-chain="chain">
   *          </div>
   * @memberOf graphApp
   */
  function graphChain() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-chain/graph-chain-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphChain - Chain object
         * @param {boolean} graphChain.value - Determine if the element has been enable/disable
         * @param {number} graphChain.position - Determine position of the element, relative to the graphRuler
         * @param {Object} graphChain.tooltip - Tootlip object
         * @param {string} graphChain.tooltip.enable - Translation key or sentence to be show on hover
         *                                              when element is enable
         * @param {string} graphChain.tooltip.disable - Translation key or sentence to be show on hover
         *                                              when element is disable
         * @param {boolean} [graphChain.disabled] - Determine if the element should be disabled hence not showed
         */
        chain: '=graphChain'
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
     * @memberOf graphApp.graphChain
     */
    function linkFn(scope, elm) {
      var chain = scope.chain;
      if (!chain) {
        return;
      }

      elm.css('left', chain.position + '%');
      chain.class = chain.colors.label;
      chain.class += chain.value ? ' fa-chain-broken' : ' fa-link show-link';
      chain.tooltip.displayed = chain.value ? chain.tooltip.enable : chain.tooltip.disable;
    }
  }
})();
