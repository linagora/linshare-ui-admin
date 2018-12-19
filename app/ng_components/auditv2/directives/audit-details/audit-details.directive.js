/**
 * auditDetails Directive
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
      $translatePartialLoaderProvider.addPart('audit');
    }])
    .run(['$translate', function($translate) {
      $translate.refresh();
    }])
    .directive('auditDetails', auditDetails);

  /**
   * @namespace auditDetails
   * @desc Dropdown with details of one audit action
   * @example <div audit-details="{{auditActionObject}}"></div>
   * @memberOf linshareAdminApp
   */
  function auditDetails() {
    var directive = {
      restrict: 'A',
      templateUrl: 'ng_components/auditv2/directives/audit-details/audit-details.html',
      link: linkFn
    };
    return directive;

    ///////////

    /**
     * @name linkFn
     * @desc DOM manipulation function, related to the directive
     * @param {Object} scope - Angular scope object of the directive
     * @param {Object} element - jqLite-wrapped element that this directive matches
     * @memberOf linshareAdminApp.auditDetails
     */
    function linkFn(scope, element) {
      var dropdownList = angular.element(element[0].querySelector('.audit-dropdown'));
      scope.$watch(function() {
        return element[0].querySelector('.btn-group').className;
      }, function(className) {
        if (dropdownList[0].parentElement.nodeName !== 'BODY') {
          attachToBody(dropdownList, element);
        }
        if (className.indexOf('open') !== -1) {
          dropdownList.addClass('audit-dropdown-open');
          dropdownList.removeClass('hide');
        } else {
          dropdownList.removeClass('audit-dropdown-open');
          dropdownList.addClass('hide');
        }
      });

      function attachToBody(dropdownList, element) {
        var position = dropdownList.offset();
        if (position.top !== 0 && position.left !== 0) {
          dropdownList.detach();
          angular.element('body').append(dropdownList);
          dropdownList.css({
            top: element.offset().top + 'px',
            left: element.offset().left + 'px'
          });
        }
      }
    }
  }
})();
