/**
 * relativeTime Filter
 * @namespace relativeTime
 * @memberOf linshareAdminApp
 */
(function() {
  'use strict';
  angular
    .module('linshareAdminApp')
    .filter('relativeTime', relativeTimeFilter);

  relativeTimeFilter.$inject = ['$translate', 'moment'];

  /**
   * @namespace relativeTimeFilter
   * @desc filter of all variables and methods for relative time filter
   * @returns {string} Value to show in view
   * @memberOf linshareAdminApp
   */
  function relativeTimeFilter($translate, moment) {
    // TODO : service where to set moment lang
    var local = $translate.use().substring(0, $translate.use().indexOf('-'));
    moment.locale(local);

    /**
     * @namespace relativeTimeToShow
     * @desc convert millis variable to relative time
     * @param {number} seconds - variable given in filter
     * @returns {string} Converted date to show in view
     * @memberOf linshareAdminApp.relativeTimeFilter
     */
    function relativeTimeToShow(seconds) {
      return moment(seconds).fromNow();
    }

    return relativeTimeToShow;
  }
})();
