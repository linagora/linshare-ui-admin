/**
 * graphContainer Directive
 * @namespace graphContainer
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphContainer', graphContainer);

  graphContainer.$inject = ['_'];

  /**
   * @namespace graphContainer
   * @desc Graph component managing container element
   * @example <div data-ng-repeat="container in graph.containers"
   *               graph-container="container" data-ng-if="!container.disabled">
   *          </div>
   * @memberOf graphApp
   */
  function graphContainer(_) {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-container/graph-container-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphContainer - Container object
         * @param {string} graphContainer.legend - Translation key or sentence which will be
         *                                         shown above the graph as a legend
         * @param {string} [graphContainer.label] - Translation key or sentence which will be
         *                                          shown below the graph as a ruler label
         * @param {Object|number|function} graphContainer.value - Value to be shown inside the container and
         *                                                        also used for calculation of element width
         * @param {string|function} [graphContainer.value.display] - Value to be shown inside the container
         * @param {number|function} [graphContainer.value.real] - Value used for calculation of element width
         * @param {Object} [graphContainer.areas] - refer to graphArea directive for object composition
         * @param {boolean|number|function} [graphContainer.footer] - determine if the ruler footer shall be shown,
         *                                                            if a value (or function returning a value) is
         *                                                            provided it will be pinpointed on the ruler
         * @param {boolean} [graphContainer.disabled] - Determine if the element should be disabled hence not showed
         */
        container: '=graphContainer'
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
     * @memberOf graphApp.graphContainer
     */
    function linkFn(scope, elm) {
      var container = scope.container;

      container.footer = container.footer || false;
      if (!_.isBoolean(container.footer)) {
        container.footer = {
          value : _.isFunction(container.footer) ? container.footer() : container.footer
        };
      }

      elm.css('flex', '0 0 ' + container.width + '%');

      if (container.areas) {
        container.colors.main += ' main-ctn-current-domain';
      }
    }
  }
})();
