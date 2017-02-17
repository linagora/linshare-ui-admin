/**
 * lsDropdown Directive
 * @namespace lsDropdownApp
 */
(function() {
  'use strict';

  angular
    .module('lsDropdownApp')
    .directive('lsDropdown', lsDropdown);

  lsDropdown.$inject = [];

  /**
   * @namespace lsDropdown
   * @desc Directive to manage a list <ul> as a <select> but with better design
   * @example
   *   <div ls-dropdown id="myDropdown" button-value="myValue" list="myList" action= "myAction(myParam)"></div>
   * @memberOf lsDropdownApp
   */
  function lsDropdown() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/common/lsdropdown/lsdropdown.html',
      scope: {
        value: '=value',
        list: '=list',
        action: '&action'
      },
      link: linkFn
    };

    return directive;

    ////////////

    /**
     * @name linkFn
     * @desc Link function of the directive
     * @param {Object} scope - Angular scope object of the directive
     * @param {Object} elm - jqLite-wrapped element that this directive matches
     * @memberOf lsDropdownApp.linkFn
     */
    function linkFn(scope, element) {
      var dropdownList = angular.element(element[0].querySelector('.ls-dropdown'));
      scope.$watch(function() {
        return element[0].querySelector('.btn-group').className;
      }, function(className) {
        if (className.indexOf('open') !== -1) {
          if (dropdownList[0].parentElement.nodeName !== 'BODY') {
            attachToBody(dropdownList);
          }
          dropdownList.addClass('ls-dropdown-open');
        } else {
          dropdownList.removeClass('ls-dropdown-open');
        }
      });

      function attachToBody(dropdownList) {
        var position = dropdownList.offset();
        if (position.top !== 0 && position.left !== 0) {
          dropdownList.detach();
          angular.element('body').append(dropdownList);
          dropdownList.css({
            top: position.top + 'px',
            'margin-top': 17 + 'px',
            'margin-left': '-' + 21 + 'px',
            left: position.left + 'px',
            display: 'block'
          });
        }
      }
    }
  }
})();
