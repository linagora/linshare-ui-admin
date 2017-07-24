/**
 * shortTime Filter
 * @namespace shortTime
 * @memberOf linshareAdminApp
 */
(function() {
  'use strict';
  angular
    .module('linshareAdminApp')
    .filter('shortTime', shortTimeFilter);

  shortTimeFilter.$inject = ['$translate', 'moment'];

  /**
   * @namespace shortTimeFilter
   * @desc filter of all variables and methods for short time filter
   * @returns {string} Value to show in view
   * @memberOf linshareAdminApp
   */
  function shortTimeFilter($translate, moment) {
    moment.locale($translate.use());

    /**
     * @namespace shortTimeToShow
     * @desc convert millis variable to relative time
     * @param {number} seconds - variable given in filter
     * @returns {string} Converted date to show in view
     * @memberOf linshareAdminApp.shortTimeFilter
     */
    function shortTimeToShow(seconds) {
      return moment(seconds).format('L');
    }

    return shortTimeToShow;
  }
})();
