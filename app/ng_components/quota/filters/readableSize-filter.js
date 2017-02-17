/**
 * readableSize Filter
 * @namespace linshareAdminApp
 */
(function()  {
  'use strict';

  angular
    .module('linshareAdminApp')
    .filter('readableSize', readableSize);

  readableSize.$inject = ['unitService'];

  /**
   * @namespace readableSize
   * @desc Convert a value to the proper unit for readability
   * @example {{ myVm.myValue | readableSize}}
   * @memberOf linshareAdminApp
   */
  function readableSize(unitService) {
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
      return _.isUndefined(value) ? 0 : unitService.byteTo(value, unit, showUnit);
    }
  };
})();
