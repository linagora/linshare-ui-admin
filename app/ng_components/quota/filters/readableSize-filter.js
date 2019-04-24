/**
 * readableSize Filter
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .filter('readableSize', readableSize);

  readableSize.$inject = ['_', 'unitService'];

  /**
   * @namespace readableSize
   * @desc Convert a value to the proper unit for readability
   * @example {{ myVm.myValue | readableSize}}
   * @memberOf linshareAdminApp
   */
  function readableSize(_, unitService) {
    /**
     * @name getReadableSize
     * @desc Convert a bit number to a defined unit in Byte
     * @param {string} value - Value to convert
     * @param {string} unit - Unit to use, can be undefined
     * @param {boolean} showUnit - Determine if unit should be return with the value
     * @returns {int} Value converted to requested unit
     * @memberOf linshareAdminApp.readableSize
     */
    return function getReadableSize(value, unit, showUnit) {
      var unitToUse = unit;
      if (!unit && showUnit) {
        unitToUse = unitService.find(value);
      }
      return _.isUndefined(value) ? 0 : unitService.byteTo(value, unitToUse, showUnit);
    };
  }
})();
