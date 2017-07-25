/**
 * graphRuler Directive
 * @namespace graphRuler
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('graphRuler', graphRuler);

  graphRuler.$inject = ['_', 'graphService'];

  /**
   * @namespace graphRuler
   * @desc Graph component managing ruler element to be shown below the graph as a ... well, a ruler !
   * @example <div data-ng-if="graph.ruler" graph-ruler="graph.ruler"></div>
   * @memberOf graphApp
   */
  function graphRuler(_, graphService) {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-ruler/graph-ruler-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} graphRuler - Ruler object
         * @param {Object} graphRuler.measure - Mandatory for calculating the ruler measures
         * @param {number} graphRuler.max Maximum measure of the ruler
         * @param {number} [graphRuler.min] - Minimum measure of the ruler, 0 if not provided
         * @param {boolean} [graphRuler.disabled] - Determine if the element should be disabled hence not showed
         */
        ruler: '=graphRuler'
      },
      link: linkFn
    };
    return directive;

    ////////////

    /**
     * @name linkFn
     * @desc link function of the directive
     * @param {Object} scope - Angular scope object of the directive
     * @memberOf graphApp.graphRuler
     */
    function linkFn(scope) {
      scope.$watch('ruler', function() {
        var ruler = scope.ruler;

        if (ruler.max) {
          ruler.max = graphService.normalize(ruler.max);
          ruler.min = ruler.min || 0;
          ruler.measure = setMeasures(ruler.min, ruler.max.real);
        }
      });

      /**
       * @name setMeasures
       * @desc Calculus of the ruler measures
       * @param {number} start - Minimum measure of the ruler
       * @param {number} stop - Maximum measure of the ruler
       * @memberOf graphApp.graphRuler
       */
      function setMeasures(start, stop) {
        var values = new Array(10);
        var measure = (stop-start)/10;
        values = _.map(values, function(value, index) {
          var pointer = start + (measure * index);
          return pointer === parseInt(pointer, 10) ? pointer : pointer.toFixed(2);
        });
        return values;
      }
    }
  }
})();
