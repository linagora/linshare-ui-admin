/**
 * lsGraph Directive
 * @namespace lsGraph
 */
(function() {
  'use strict';

  angular
    .module('graphApp')
    .directive('lsGraph', lsGraph);

  lsGraph.$inject = ['_', '$translate', 'graphService'];

  /**
   * @namespace lsGraph
   * @desc Graph directive for showing data as a stacked horizontal bar ... not sure of the proper name though
   * @example <section data-ls-graph="graph" data-ng-if="isGraphReady"></section>
   * @memberOf graphApp
   */
  function lsGraph(_, $translate, graphService) {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/quota/directives/lsgraph/graph-template.html',
      replace: true,
      scope: {
        /**
         * @param {Object} lsGraph - Graph object
         * @param {Object[]} lsGraph.colors - List of colors to be used for the graph
         *                                    The list of available colors can be found in graphService
         *                                    Each colors must defined a number of classes,
         *                                    refer to colors.scss to make custom colors
         *                                    to see colors management refer to :
         *                                      - lsGraph.manageColors
         *                                      - graphService.manageColorsOverride
         * @param {Object} lsGraph.ruler - Refer to graphRuler directive for object composition
         * @param {Object} lsGraph.limit - Refer to graphLimit directive for object composition
         * @param {Object[]} lsGraph.containers - Refer to graphContainer directive for object composition
         * @param {Object[]} lsGraph.chains - Refer to graphChain directive for object composition
         */
        graph: '=lsGraph'
      },
      link: linkFn
    };
    return directive;

    ////////////

    /**
     * @name linkFn
     * @desc link function of the directive
     * @param {Object} scope - Angular scope object of the directive
     * @memberOf graphApp.lsGraph
     */
    function linkFn(scope) {
      scope.$watch('graph', function() {
        var graph = scope.graph;
        if (!graph.containers) {
          return;
        }

        calculus(graph);
        manageRuler(graph);
        manageColors(graph);
        manageContainers(graph);
        manageChain(graph);
        manageLabels(graph);
        manageLegends(graph);
        manageLimit(graph);
      });

      /**
       * @name calculus
       * @desc Calculation of graph element in order to set their width.
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function calculus(graph) {
        var containers = graph.containers;
        graph.sum =  _.reduce(containers, function(sum, container) {
          if (container.disabled) {
            return sum;
          }
          container.value = graphService.normalize(container.value);
          var value = container.value.real;
          container.sum = _.isNumber(value) ? value : parseFloat(value);
          return sum + container.sum;
        }, 0);
      }

      /**
       * @name manageColors
       * @desc Manage colors across graph elements, by renaming to correct classes &/or adding some
               if the list is not provided or if it's not enough
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageColors(graph) {
        if (!graph.colors) {
          graph.colors = ['graph-color-blue', 'graph-color-purple', 'graph-color-green'];
        } else {
          graph.colors = _.isArray(graph.colors) ? graph.colors : [graph.colors];
          graph.colors = _.map(graph.colors, function(color) {
            return 'graph-color-' + color;
          });
        }

        var index = 0;
        while (graph.containers.length - graph.colors.length > 1) {
          graph.colors.push(graph.colors[index] + '-stripes');
          index++;
        }
        graph.colors.push('');
      }

      /**
       * @name manageContainers
       * @desc Manage Container object by setting width, colors & other classes
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageContainers(graph) {
        var containers = graph.containers;
        var widthSum = 0;

        _.forEach(containers, function(container, index) {
          container.colors = graphService.manageColorsOverride(container);
          container.colors = {
            main: container.colors.main || graph.colors[index] + '-main',
            label: container.colors.label || graph.colors[index].replace('-stripes', '') + '-label',
            border: container.colors.border || graph.colors[index].replace('-stripes', '') + '-border'
          };

          manageBorder(container, index);

          container.display =  false;
          container.width = 0;
          if (!container.disabled && container.sum > 0 ) {
            container.width = container.sum / graph.sum * 100;
            container.width -= container.width >= 100 ? 0.07 * graph.containers.length : 0;
            widthSum += container.width;
            container.display = container.width > 3;

            if (container.areas) {
              _.forEach(container.areas, function(area, index) {
                area.colors = graphService.manageColorsOverride(area);
                area.value = graphService.normalize(area.value);
                area.width = area.value.real === 0 ? 0 : area.value.real / container.sum * 100;
                area.display = container.display && area.width > 3;
                container.display = !area.display ? false : container.display;
                area.colors.main = area.colors.main || '';
                area.colors.main += index > 0 ? ' border-left-white' : '';
              });
            }
          }

          graph.alert = widthSum > 100;
        });

        var containersVisible = _.filter(containers, {display: true});
        if (containersVisible.length === 1) {
          containersVisible[0].colors.main += ' no-border';
        }

        /**
         * @name manageBorder
         * @desc Manage Container border
         *       This method mutate the given object
         * @param {Object} container - Container object
         * @param {number} index - Index of the Container object inside the Containers array
         * @memberOf graphApp.lsGraph.manageContainers
         */
        function manageBorder(container, index) {
          if (index < (containers.length - 1)) {
            if (container.dynamic) {
              container.colors.main += ' border-right';
            } else {
              container.colors.main += ' border-right-dotted';
            }
          }

        }
      }

      /**
       * @name manageLabels
       * @desc Create Label object depending on container data
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageLabels(graph) {
        graph.labels = [];
        _.forEach(graph.containers, function(container, index) {
          if (!container.label) {
            return;
          }

          container.label = {
            value: container.label,
            colors: container.colors,
            disabled: container.disabled,
            position: index > 0 ? graph.containers[index - 1].width : 0
          };

          container.label.colors = {
            label: container.label.colors.label || graph.colors[index].replace('-stripes', '') + '-label'
          };

          graph.labels.push(container.label);
        });
      }

      /**
       * @name manageChain
       * @desc Manage Chain object by setting its values, colors & position
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageChain(graph) {
        if (!graph.chains) {
          return;
        }

        graph.chains = _.isArray(graph.chains) ? graph.chains : [graph.chains];
        _.forEach(graph.chains, function(chain, index) {
          chain.colors = graphService.manageColorsOverride(chain);
          chain.colors = {
            main: chain.colors.main || graph.colors[index].replace('-stripes', '') + '-main',
            label: chain.colors.label || graph.colors[index].replace('-stripes', '') + '-label'
          };

          if (chain.position) {
            chain.position = chain.position / graph.sum * 100;
          }
        });
      }

      /**
       * @name manageLegend
       * @desc Create Legend object depending on container data
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageLegends(graph) {
        graph.legends = [];
        _.forEach(graph.containers, function(container, index) {
          if (!container.legend) {
            return;
          }

          container.legend = {
            value: container.legend,
            colors: container.colors,
            disabled: container.disabled,
            param : container.display ? '' : {value: container.value.display}
          };

          container.legend.colors = {
            legend: container.legend.colors.legend || graph.colors[index] + '-legend'
          };

          if (container.areas) {
            container.legend.colors.main = 'hint';
            container.legend.tooltip = '';
            _.forEach(container.areas, function(area, index) {
              $translate(area.tooltip, {value: area.value.display}).then(function(translation) {
                container.legend.tooltip += translation + (index === container.areas.length - 1 ? '' : ' / ');
              });
            });
          }

          graph.legends.push(container.legend);
        });
      }

      /**
       * @name manageLimit
       * @desc Manage Limit object by setting its colors
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageLimit(graph) {
        if (!graph.limit) {
          return;
        }

        graph.limit.colors = graphService.manageColorsOverride(graph.limit);
        graph.limit.colors.label = graph.limit.colors.label || 'graph-color-orange-label';
      }

      /**
       * @name manageRuler
       * @desc Manage Ruler object by setting its colors
       *       This method mutate the given object
       * @param {Object} graph - Graph object
       * @memberOf graphApp.lsGraph
       */
      function manageRuler(graph) {
        if (!graph.ruler) {
          return;
        }

        var ruler = graph.ruler;
        if (graph.ruler.max) {
          ruler.max = graphService.normalize(ruler.max);
          ruler.max.colors = graphService.manageColorsOverride(ruler.max);
          ruler.max.colors.main = ruler.max.colors.main ||
            graph.colors[0].replace('-stripes', '') + '-main';
          ruler.max.colors.label = ruler.max.colors.label ||
            graph.colors[0].replace('-stripes', '') + '-label';
        }
      }
    }
  }
})();
