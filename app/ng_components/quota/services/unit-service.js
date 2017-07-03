/**
 * unitService Factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('unitService', unitService);

  unitService.$inject = ['_'];

  function unitService(_) {
    var units = {
      B: {
        value: 'B',
        factor: 0
      },
      KB: {
        value: 'KB',
        factor: 3
      },
      MB: {
        value: 'MB',
        factor: 6
      },
      GB: {
        value: 'GB',
        factor: 9
      },
      TB: {
        value: 'TB',
        factor: 12
      },
      PB: {
        value: 'PB',
        factor: 15
      },
      EB: {
        value: 'EB',
        factor: 18
      },
      ZB: {
        value: 'ZB',
        factor: 21
      },
      YB: {
        value: 'YB',
        factor: 24
      }
    };
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
      var result = 0;
      if (_.isUndefined(value) || value === null || isNaN(value)) {
        return result;
      }
      var unit = _.isUndefined(selectedUnit) ? find(value) : selectedUnit;
      result = value / Math.pow(10, units[unit].factor);
      result = (result % 1 === 0) ? result : result.toFixed(2);
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
      var
        length = value.toString().length,
         multiple3 = {
           1: 3,
           2: 3,
           4: 6,
           5: 6,
           7: 9,
           8: 9,
           10: 12,
           11: 12,
           13: 15,
           14: 15,
           16: 18,
           17: 18,
           19: 21,
           20: 21,
           22: 24,
           23: 24,
        },
        size = {
          3: units.B.value,
          6: units.KB.value,
          9: units.MB.value,
          12: units.GB.value,
          15: units.TB.value,
          18: units.PB.value,
          21: units.EB.value,
          24: units.ZB.value
        };

      if (multiple3.hasOwnProperty(length)) {
        length = multiple3[length];
      }

      if (size.hasOwnProperty(length)) {
        return size[length];
      } else {
          return units.YB.value;
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
      var result = 0;
      if (_.isUndefined(value) || value === null || isNaN(value)) {
        return result;
      }
      result = value * Math.pow(10, units[unit].factor);
      result = (result % 1 === 0) ? result : result.toFixed(2);
      return showUnit ? result + units.B : result;
    }
  }
})();
