/**
 * unitService Factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('unitService', unitService);

  function unitService() {
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var service = {
      byteTo: byteTo,
      find: find,
      toByte: toByte,
      units: units
    };

    return service;

    ////////////

    /**
     * @name byteTo
     * @desc Convert a bit number to a defined unit in Byte
     * @param {string} value - Value to convert
     * @param {string} selectedUnit - Unit to use if setted
     * @param {boolean} showUnit - Determine if unit should be return with the value
     * @returns {int} Value converted to requested unit
     * @memberOf linshareAdminApp.unitService
     */
    function byteTo(value, selectedUnit, showUnit) {
      if (_.isUndefined(value) || value === null || isNaN(value)) {
        return 0;
      }
      var unit = _.isUndefined(selectedUnit) ? find(value) : selectedUnit;
      var result = 0;
      switch (unit) {
        case 'B':
          result = value;
          break;
        case 'KB':
          result = value / 1000;
          break;
        case 'MB':
          result = value / 1000000;
          break;
        case 'GB':
          result = value / 1000000000;
          break;
        case 'TB':
          result = value / 1000000000000;
          break;
        case 'PB':
          result = value / 1000000000000000;
          break;
        case 'EB':
          result = value / 1000000000000000000;
          break;
        case 'ZB':
          result = value / 1000000000000000000000;
          break;
        case 'YB':
          result = value / 1000000000000000000000000;
          break;
      }
      result = result % 1 === 0 ? result : result.toFixed(2);
      return showUnit ? result + ' ' + unit : result;
    }

    /**
     * @name find
     * @desc Set the most apropriate unit for the value given
     * @param {string} value - A value
     * @returns {string} The most apropriate unit
     * @memberOf linshareAdminApp.unitService
     */
    function find(value) {
      switch (value.toString().length) {
        case 1:
        case 2:
        case 3:
          return units[0];
          break;
        case 4:
        case 5:
        case 6:
          return units[1];
          break;
        case 7:
        case 8:
        case 9:
          return units[2];
          break;
        case 10:
        case 11:
        case 12:
          return units[3];
          break;
        case 13:
        case 14:
        case 15:
          return units[4];
          break;
        case 16:
        case 17:
        case 18:
          return units[5];
          break;
        case 19:
        case 20:
        case 21:
          return units[6];
          break;
        case 22:
        case 23:
        case 24:
          return units[6];
          break;
        default:
          return units[7];
          break;
      }
    }

    /**
     * @name toByte
     * @desc Convert a number with a defined unit to a Byte number
     * @param {string} value - Value to convert
     * @param {string} unit - Unit of the value
     * @returns {int} Value converted to requested unit
     * @memberOf linshareAdminApp.uniteService
     */
    function toByte(value, unit, showUnit) {
      if (_.isUndefined(value) || value === null || isNaN(value)) {
        return 0;
      }
      var result = 0;
      switch (unit) {
        case 'B':
          result = value;
          break;
        case 'KB':
          result = value * 1000;
          break;
        case 'MB':
          result = value * 1000000;
          break;
        case 'GB':
          result = value * 1000000000;
          break;
        case 'TB':
          result = value * 1000000000000;
          break;
        case 'PB':
          result = value * 1000000000000000;
          break;
        case 'EB':
          result = value * 1000000000000000000;
          break;
        case 'ZB':
          result = value * 1000000000000000000000;
          break;
        case 'YB':
          result = value * 1000000000000000000000000;
          break;
      }
      result = result % 1 === 0 ? result : result.toFixed(2);
      return showUnit ? result + 'B': result;
    }
  }
})();
