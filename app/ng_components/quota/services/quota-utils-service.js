/**
 * quotaUtilsService Factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('quotaUtilsService', quotaUtilsService);

  quotaUtilsService.$inject = ['_', '$q', '$timeout'];

  /**
   * @namespace quotaUtilsService
   * @desc Utils Service for Quota Object
   * @memberOf linshareAdminApp
   */
  function quotaUtilsService(_, $q, $timeout) {

    var
      domainType = {
        root: 'ROOTDOMAIN',
        top: 'TOPDOMAIN',
        sub: 'SUBDOMAIN',
        guest: 'GUESTDOMAIN'
      },
      unit = {
        accounts: {
          defaultQuota: undefined,
          defaultMaxFileSize: undefined,
          quota: undefined,
          maxFileSize: undefined,
          usedSpace: undefined
        },
        domains: {
          defaultQuota: undefined,
          quota: undefined,
          currentValueForSubdomains: undefined,
          usedSpace: undefined
        },
        parentdomains: {
          quota: undefined,
          defaultQuota: undefined
        },
        parentuser: {
          defaultAccountQuota: undefined,
          defaultMaxFileSize: undefined,
          defaultQuota: undefined
        },
        parentworkgroup: {
          defaultAccountQuota: undefined,
          defaultMaxFileSize: undefined,
          defaultQuota: undefined
        },
        user: {
          accountQuota: undefined,
          defaultAccountQuota: undefined,
          defaultMaxFileSize: undefined,
          defaultQuota: undefined,
          maxFileSize: undefined,
          quota: undefined,
          usedSpace: undefined
        },
        workgroup: {
          accountQuota: undefined,
          defaultAccountQuota: undefined,
          defaultMaxFileSize: undefined,
          defaultQuota: undefined,
          maxFileSize: undefined,
          quota: undefined,
          usedSpace: undefined
        }
      };

    var
      service = {
        capitalize: capitalize,
        formRender: formRender,
        formParser: formParser,
        getPercentage: getPercentage,
        hasSubdomain: hasSubdomain,
        isRootDomain: isRootDomain,
        manageOverride: manageOverride,
        setMatchingProperties: setMatchingProperties,
        unit: unit
      };

    return service;

    ////////////

    /**
     * @name capitalize
     * @desc Set the first letter of a string in upperCase
     * @param {string} value - Value to be capitalized
     * @returns {String} the value capitalize
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    //TODO - KLE: To be put in a util module
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.substr(1);
    }

    /**
     * @name formParser
     * @desc Force parsers of element present in form
     * @param {DOM Object} form - The form containing the element to be parsed
     * @returns {Promise}
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    //TODO - KLE: To be put in a util module
    function formParser(form) {
      var promises = _.map(form, function(elm) {
        if (!_.isUndefined(elm.$parsers)) {
          return _.map(elm.$parsers, function(parser) {
            $timeout(function() {
              return $q.when(parser(elm.$viewValue));
            }, 0);
          });
        }
        return $q.when(true);
      });
      return $q.all(_.flatten(promises));
    }

    /**
     * @name formRender
     * @desc Force render of element present in form
     * @param {DOM Object} form - The form containing the element to be rendered
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    //TODO - KLE: To be put in a util module
    function formRender(form) {
      return formParser(form).then(function() {
          return $q.when(
            _.forEach(form, function(elm) {
              if (!_.isUndefined(elm.$render)) {
                elm.$render();
              }
            })
          );
      });
    }

    /**
     * @name getPercentage
     * @desc Get value in percentage of a division
     * @param {number} dividend - The dividend value
     * @param {number} divisor - The divisor value
     * @returns {int} Value in percentage of the division
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    //TODO - KLE: To be put in a util module
    function getPercentage(dividend, divisor) {
      var result = (dividend / divisor) * 100;
      return result % 1 === 0 ? result : result.toFixed(2);
    }

    /**
     * @name hasSubdomain
     * @desc Determine if the current domain posses subdomain
     * @returns {boolean}
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    function hasSubdomain(quotaDto) {
      if (quotaDto.domain.type === domainType.top || quotaDto.domain.type === domainType.root) {
        return true;
      }
      return false;
    }

    /**
     * @name isRootDomain
     * @desc Determine if the current domain is of type ROOT
     * @returns {boolean}
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    function isRootDomain(quotaDto) {
      return quotaDto.domain.type === domainType.root;
    }

    /**
     * @name manageOverride
     * @desc Invert bool value of override and set default value if true
     *       This method mutate the element object
     * @param {Object} element - Dto object triggering override
     * @param {Object} parent - Dto object parent of element
     * @param {string} property - Name of the property to be overridden
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    function manageOverride(element, parent, property) {
      var
        bool = property + 'Override',
        defaultPropertyName = 'default' + capitalize(property.replace('default', '')),
        getter = 'get' + capitalize(defaultPropertyName),
        setter = 'set' + capitalize(property);

      element[bool] = !element[bool];
      if (!element[bool]) {
        unit[element.type ? element.type.toLowerCase().replace('_','') : element.route][property] =
          unit[parent.route][defaultPropertyName];
        if(parent[getter]) {
          element[setter](parent[getter]());
        }
      }
    }

    /**
     * @name setMatchingProperties
     * @desc Set multiple property value at once base on the key name
     * @param {Object} obj - Object where to find the properties
     * @param {string} keyToFind - Key name, or part of it, to be found
     * @param {*} val - Value to be setted
     * @memberOf linshareAdminApp.quotaUtilsService
     */
    //TODO - KLE: To be put in a util module
    function setMatchingProperties(obj, keyToFind, val) {
      _.forOwn(obj, function(value, key) {
        if (key.indexOf(keyToFind) !== -1) {
          obj[key] = val;
        }
      });
    }
  }
})();
