/**
 * graphService Factory
 * @namespace graphApp
 */
(function() {
  'use strict';

    angular
      .module('graphApp')
      .factory('graphService', graphService);

  graphService.$inject = ['_'];

  /**
   * @namespace graphService
   * @desc Utilities for graph component
   * @memberOf graphApp
   */
   function graphService(_) {
     var colors = {
       blue: 'blue',
       green: 'green',
       greenStripes: 'green-stripes',
       grey: 'grey',
       orange: 'orange',
       purple: 'purple',
       purpleStripes: 'purple-stripes'
     };

     var service = {
       colors: colors,
       manageColorsOverride: manageColorsOverride,
       normalize: normalize
     };
     return service;

     ////////////

     /**
      * @name manageColorsOverride
      * @desc Perform manipulation to normalize array of colors for the given element.
      * @param {Object} element - Element to be normalized
      * @memberOf graphApp.graphService
      */
     function manageColorsOverride(element) {
       var colors = {};

       if (!element.colors) {
         return colors;
       }

       if (_.isObject(element.colors)) {
         _.forEach(element.colors, function(color, property) {
           colors[property] = 'graph-color-' + color + '-' + property;
         });
       }

       if (_.isString(element.colors)) {
         colors.main = 'graph-color-' + element.colors + '-main';
         colors.label = 'graph-color-' + element.colors + '-label';
         colors.border = 'graph-color-' + element.colors + '-border';
         colors.legend = 'graph-color-' + element.colors + '-legend';
       }
       return colors;
     }

     /**
      * @name normalize
      * @desc Perform manipulation to normalize value for the given element.
      * @param {Object} element - Element to be normalized
      * @memberOf graphApp.graphService
      */
     function normalize(element) {
       var value = _.isObject(element) ?
         element : {real: element, display: element};
       value.real = _.isFunction(value.real) ? value.real() : value.real;
       value.display = _.isFunction(value.display) ? value.display() : value.display;
       return value;
     }
   }
})();
