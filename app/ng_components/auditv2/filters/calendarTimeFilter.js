/**
 * calendarTime Filter
 * @namespace calendarTime
 * @memberOf linshareAdminApp
 */
(function() {
  'use strict';
  angular
    .module('linshareAdminApp')
    .filter('calendarTime', calendarTimeFilter);

  calendarTimeFilter.$inject = ['$translate', 'moment'];

  /**
   * @namespace calendarTimeFilter
   * @desc filter of all variables and methods for calendar time filter
   * @returns {string} Value to show in view
   * @memberOf linshareAdminApp
   */
  function calendarTimeFilter($translate, moment) {
    moment.locale($translate.use());

    /**
     * @namespace calendarTimeToShow
     * @desc convert millis variable to calendar time
     * @param {number} seconds - variable given in filter
     * @returns {string} Converted date to show in view
     * @memberOf linshareAdminApp.calendarTimeFilter
     */
    function calendarTimeToShow(seconds) {
      return moment(seconds).format('LLLL');
    }

    return calendarTimeToShow;
  }
})();
