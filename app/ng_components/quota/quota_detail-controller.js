/**
 * QuotaDetailController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('QuotaDetailController', QuotaDetailController);

  QuotaDetailController.$inject = ['$filter', '$q', '$scope', '$timeout', 'authenticatedUser', 'domainDto',
    'Notification', 'quotaRestService', 'unitService'
  ];

  /**
   * @namespace QuotaDetailController
   * @desc Application quota management system controller
   * @memberOf linshareAdminApp
   */
  function QuotaDetailController($filter, $q, $scope, $timeout, authenticatedUser, domainDto, Notification,
    quotaRestService, unitService) {
    /* jshint validthis: true */
    var quotaVm = this;
    var domainType = {
      root: 'ROOTDOMAIN',
      top: 'TOPDOMAIN',
      sub: 'SUBDOMAIN',
      guest: 'GUESTDOMAIN'
    };

    quotaVm.cloned = {};
    quotaVm.domainDto = domainDto;
    quotaVm.formParser = formParser;
    quotaVm.formRender = formRender;
    quotaVm.getPercentage = getPercentage;
    quotaVm.getTemplate = getTemplate;
    quotaVm.hasSubdomain = hasSubdomain;
    quotaVm.isInputDisabled = isInputDisabled;
    quotaVm.isRootDomain = isRootDomain;
    quotaVm.reset = reset;
    quotaVm.setParentDefault = setParentDefault;
    quotaVm.unit = {
      domains: {
        defaultQuota: undefined,
        quota: undefined,
        usedSpace: undefined
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
      },
      value: unitService.units
    }
    quotaVm.unitService = unitService;
    quotaVm.update = update;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function activate() {
      quotaRestService.getDomain(domainDto.quota).then(function(domainData) {
        initDto(domainData);
        _.forEach(quotaVm.domainQuotaDto.containerUuids, function(containerUuid) {
          quotaRestService.getContainer(containerUuid).then(function(containerData) {
            initDto(containerData);
          })
        })
      });
    }

    /**
     * @name capitalize
     * @desc Set the first letter of a string in upperCase
     * @param {string} value - Value to be capitalized
     * @returns {String} the value capitalize
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO - KLE: To be put in a util module
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.substr(1);
    }

    /**
     * @name formParser
     * @desc Force parsers of element present in form
     * @param {DOM Object} form - The form containing the element to be parsed
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO - KLE: To be put in a util module
    function formParser(form) {
      _.forEach(form, function(elm) {
        if (!_.isUndefined(elm.$parsers)) {
          _.forEach(elm.$parsers, function(parser) {
            $timeout(function() {
              parser(elm.$viewValue);
            }, 0);
          })
        }
      })
    }
    /**
     * @name formRender
     * @desc Force render of element present in form
     * @param {DOM Object} form - The form containing the element to be rendered
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO - KLE: To be put in a util module
    function formRender(form) {
      _.forEach(form, function(elm) {
        if (!_.isUndefined(elm.$render)) {
          elm.$render();
        }
      })
    }

    /**
     * @name getPercentage
     * @desc Get value in percentage of a division
     * @param {number} dividend - The dividend value
     * @param {number} divisor - The divisor value
     * @returns {int} Value in percentage of the division
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO - KLE: To be put in a util module
    function getPercentage(dividend, divisor) {
      var result = (dividend / divisor) * 100;
      return result % 1 === 0 ? result : result.toFixed(2);
    }

    /**
     * @name getTemplate
     * @desc Return template of helper
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function getTemplate() {
      return 'QUOTA_DETAILS';
    };

    /**
     * @name hasSubdomain
     * @desc Determine if the current domain posses subdomain
     * @returns {boolean}
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function hasSubdomain() {
      if (quotaVm.domainDto.type === domainType.top || quotaVm.domainDto.type === domainType.root) {
        return true;
      }
      return false;
    }

    /**
     * @name initDto
     * @desc Initialise DTO element by cloning them and adding get/set
     * @param {Object} data - Server response data
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function initDto(data) {
      switch (data.route) {
        case 'domains':
          quotaVm.domainQuotaDto = data;
          quotaVm.cloned.domainQuotaDto = _.cloneDeep(data);
          quotaVm.cloned.unit = _.cloneDeep(quotaVm.unit);
          setModelGetSet(quotaVm.domainQuotaDto);
          break;
        case 'containers':
          switch (data.type) {
            case 'USER':
              quotaVm.userQuotaDto = data;
              quotaVm.cloned.userQuotaDto = _.cloneDeep(data);
              quotaVm.cloned.unit.user = _.cloneDeep(quotaVm.unit.user);
              setModelGetSet(quotaVm.userQuotaDto);
              break;
            case 'WORK_GROUP':
              quotaVm.workgroupQuotaDto = data;
              quotaVm.cloned.workgroupQuotaDto = _.cloneDeep(data);
              quotaVm.cloned.unit.workgroup = _.cloneDeep(quotaVm.unit.workgroup);
              setModelGetSet(quotaVm.workgroupQuotaDto);
              break;
          }
      }
    }

    /**
     * @name FunctionName
     * @desc description
     * @param {String} name - desc
     * @returns {String} if there is one
     * @memberOf NameSpaceGlobal.ElementName
     */
    function isInputDisabled(linked) {
      if (isRootDomain()) {
        return false;
      }
      return linked;
    }

    /**
     * @name isRootDomain
     * @desc Determine if the current domain is of type ROOT
     * @returns {boolean}
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function isRootDomain() {
      return quotaVm.domainDto.type === domainType.root;
    }

    /**
     * @name reset
     * @desc Reset form to initial state
     * @param {DOM Object} form - The form containing the element to be reset
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function reset(form) {
      quotaVm.domainQuotaDto = _.cloneDeep(quotaVm.cloned.domainQuotaDto);
      quotaVm.userQuotaDto = _.cloneDeep(quotaVm.cloned.userQuotaDto);
      quotaVm.workgroupQuotaDto = _.cloneDeep(quotaVm.cloned.workgroupQuotaDto);
      quotaVm.unit = _.cloneDeep(quotaVm.cloned.unit);
      setModelGetSet(quotaVm.domainQuotaDto);
      setModelGetSet(quotaVm.userQuotaDto);
      setModelGetSet(quotaVm.workgroupQuotaDto);
      quotaVm.formParser(form);
      quotaVm.formRender(form);
    }

    /**
     * @name setModelGetSet
     * @desc For each model containing property name referenced as keys in quotaVm.unit:
     *       Add a get and set function to take unit conversion into account while updating or requestion those values
     *       Also set the unit to be used, depending on the original object property value
     * @example
     *          domainQuotaDto.quota = 1000,
     *          domainQuotaDto.getDomainsQuota = function() {
     *            $filter('readableSize')(domainQuotaDto.quota.original, unit.domain.quota, false);
     *          }
     *          domainQuotaDto.setDomainsQuota = function(newValue, form) {
     *            unitService.toByte(newValue, unit.domain.quota);
     *            formParser(form);
     *          }
     * @param {Object} data - Data used to find unit
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO: Need to update angular to 1.3 avoid this awful trick and use ng-model-options="{ getterSetter: true }"
    //TODO - KLE: To be put in a util module
    function setModelGetSet(data) {
      var keyName = _.find(Object.keys(quotaVm.unit), function(key) {
        if (key === data.route) {
          return true;
        } else {
          return data.type.toLowerCase().replace('_', '') === key;
        }
      });
      _.forEach(Object.keys(quotaVm.unit[keyName]), function(propertyKey) {
        //TODO - KLE: Test to be removed once the back fill the missing fields in DTO
        quotaVm.unit[keyName][propertyKey] = (_.isUndefined(data[propertyKey]) ||  data[propertyKey] === null) ? 'GB' : quotaVm.unitService.find(data[propertyKey]);
        data['get' + capitalize(keyName) + capitalize(propertyKey)] = function get() {
          return $filter('readableSize')(data[propertyKey], quotaVm.unit[keyName][propertyKey], false);
        };
        data['set' + capitalize(keyName) + capitalize(propertyKey)] = function set(newValue, form) {
          data[propertyKey] = quotaVm.unitService.toByte(newValue, quotaVm.unit[keyName][propertyKey]);
          quotaVm.formParser(form);
          //Need to reset the get function because on update of model, the function is replaced by the value
          data['get' + capitalize(keyName) + capitalize(propertyKey)] = function get() {
            return $filter('readableSize')(data[propertyKey], quotaVm.unit[keyName][propertyKey], false);
          };
        }
      });
      data.isExceeded = function isExceeded() {
        var initDto = _.find(quotaVm.cloned, function(dto) {
          return dto.uuid === data.uuid
        });
        return initDto.usedSpace >= initDto.quota;
      }
    }

    /**
     * @name setMatchingProperties
     * @desc Set multiple property value at once base on the key name
     * @param {Object} obj - Object where to find the properties
     * @param {string} keyToFind - Key name, or part of it, to be found
     * @param {*} val - Value to be setted
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    //TODO - KLE: To be put in a util module
    function setMatchingProperties(obj, keyToFind, val) {
      _.forOwn(obj, function(value, key) {
        if (key.indexOf(keyToFind) !== -1) {
          obj[key] = val;
        }
      });
    }

    /**
     * @name setParentDefault
     * @desc Reset domain quota to parent default value
     * @param {DOM Object} form - The form containing the element to be reset
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function setParentDefault(form) {
      setMatchingProperties(quotaVm.domainQuotaDto, 'Override', false)
      setMatchingProperties(quotaVm.userQuotaDto, 'Override', false)
      setMatchingProperties(quotaVm.workgroupQuotaDto, 'Override', false)
      quotaVm.update();
    }

    /**
     * @name update
     * @desc Update Quota for domain & containers
     * @param {DOM Object} form - The form containing the element to be reset
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function update(form) {
      quotaRestService.updateDomain(quotaVm.domainQuotaDto).then(function(domainData) {
        initDto(domainData);
        $q.all([
          quotaRestService.updateContainer(quotaVm.userQuotaDto),
          quotaRestService.updateContainer(quotaVm.workgroupQuotaDto)
        ]).then(function(containersData) {
          Notification.addNotification('MANAGE_QUOTA.NOTIFICATION.UPDATE');
          _.forEach(containersData, function(containerData) {
            initDto(containerData);
            quotaVm.formParser(form);
            quotaVm.formRender(form);
          });
        }).catch(function(error) {
          Notification.addError(error);
        });
      });
    }
  }
})();
