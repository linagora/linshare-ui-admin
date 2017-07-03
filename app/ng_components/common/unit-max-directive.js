/**
 * unitMax Directive
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .directive('unitMax', unitMax);

  unitMax.$inject = ['_', 'unitService'];

  /**
   * @namespace unitMax
   * @desc Allow to set a max value for a text input acting as a number input
   *       This is a tweak due to the angular version that doesnt allow ngModel as a function
   *       Should be deleted after update of angular
   * @example <input type="text" name="myInput"
   *                 x-ng-model="myVm.getValue"
   *                 x-ng-change="myVm.setValue(myForm.myInput.$viewValue)"
   *                 x-unit="TB"
   *                 x-unit-max="50">
   * @memberOf linshareAdminApp
   */
  function unitMax(_, unitService) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: linkFn,
      scope: {
        unitMax: '=unitMax',
        unit: '=unit'
      }
    };

    return directive;

    ////////////

    /**
     * @name linkFn
     * @desc link function of the directive
     * @param {Object} scope - Angular scope object of the directive
     * @param {Object} elm - jqLite-wrapped element that this directive matches
     * @param {Object} attrs - Normalized attribute names and their corresponding attribute values
     * @param {Object} modelController - Directive's required controller instance(s)
     * @memberOf linshareAdminApp.unitMax
     */
    function linkFn(scope, element, attrs, modelController) {
      function validUnit(val) {
        var value;
        if (_.isFunction(val)) {
          value = val();
        } else {
          if (isNaN(val)) {
            modelController.$setValidity('unitMax', false);
            return undefined;
          }
          value = val;
        }
        if (unitService.toByte(value, scope.unit) > scope.unitMax) {
          modelController.$setValidity('unitMax', false);
          return undefined;
        } else {
          modelController.$setValidity('unitMax', true);
          return value;
        }
      }
      modelController.$parsers.unshift(validUnit);
    }
  }
})();
