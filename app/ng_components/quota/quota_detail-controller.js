/**
 * QuotaDetailController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('QuotaDetailController', QuotaDetailController);

  QuotaDetailController.$inject = ['_', '$filter', '$q', '$scope', '$timeout', 'authenticatedUser', 'domainDto',
                                   'domainQuotaDto', 'graphService', 'Notification', 'parentDomainQuotaDto',
                                   'parentContainersQuotaDto','quotaGraphService', 'quotaRestService',
                                   'quotaUtilsService', 'unitService'
                                  ];

  /**
   * @namespace QuotaDetailController
   * @desc Application quota management system controller
   * @memberOf linshareAdminApp
   */
  /* jshint maxparams: false */
  function QuotaDetailController(_, $filter, $q, $scope, $timeout, authenticatedUser, domainDto, domainQuotaDto,
                                 graphService, Notification, parentDomainQuotaDto, parentContainersQuotaDto,
                                 quotaGraphService, quotaRestService, quotaUtilsService, unitService) {
    /* jshint validthis: true */
    var quotaVm = this;
    quotaVm.cloned = {};
    quotaVm.capitalize = quotaUtilsService.capitalize;
    quotaVm.domainDto = domainDto;
    quotaVm.formRender = quotaUtilsService.formRender;
    quotaVm.getPercentage = quotaUtilsService.getPercentage;
    quotaVm.getTemplate = getTemplate;
    quotaVm.hasSubdomain = quotaUtilsService.hasSubdomain;
    quotaVm.isInputDisabled = isInputDisabled;
    quotaVm.isRootDomain = quotaUtilsService.isRootDomain;
    quotaVm.manageOverride = manageOverride;
    quotaVm.parentContainersQuotaDto = parentContainersQuotaDto;
    quotaVm.parentDomainQuotaDto = parentDomainQuotaDto;
    quotaVm.reset = reset;
    quotaVm.setParentDefault = setParentDefault;
    quotaVm.setMatchingProperties = quotaUtilsService.setMatchingProperties;
    quotaVm.unit = quotaUtilsService.unit;
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
      quotaVm.unit.value = _.map(unitService.units, function(unit) {
        return unit.value;
      });

      quotaVm.isGraphReady = false;

      initDto(domainQuotaDto);
      if (!quotaVm.isRootDomain(quotaVm.domainQuotaDto)) {
        setModelGetSet(quotaVm.parentDomainQuotaDto);
        _.forEach(quotaVm.parentContainersQuotaDto, function(container) {
          setModelGetSet(container);
        });
      }
      $q.all(_.map(quotaVm.domainQuotaDto.containerUuids, function(containerUuid) {
        return quotaRestService.getContainer(containerUuid).then(function(containerData) {
          initDto(containerData);
        });
      })).then(function(){
        quotaVm.graph =  buildGraph();
        quotaVm.isGraphReady = true;
      });
    }

    /**
     * @name buildGraph
     * @desc Build all quota graph
     * @returns {Object} A graph object
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function buildGraph() {
      var graph = {};
      var quotaDto = {
        domain: quotaVm.domainQuotaDto,
        user: quotaVm.userQuotaDto,
        workgroup: quotaVm.workgroupQuotaDto,
        parentDomain : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.domainQuotaDto : quotaVm.parentDomainQuotaDto,
        parentUser : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.userQuotaDto : quotaVm.parentContainersQuotaDto.user,
        parentWorkgroup : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.workgroupQuotaDto : quotaVm.parentContainersQuotaDto.workgroup
      };

      graph.domain = quotaGraphService.buildGraphDomain(quotaDto);
      graph.personalSpace = quotaGraphService.buildGraphContainer(quotaDto, 'PERSONAL_SPACE');
      graph.sharedSpace = quotaGraphService.buildGraphContainer(quotaDto, 'SHARED_SPACE');
      graph.domainContainers =
        quotaGraphService.buildGraphDomainContainers(quotaDto);
      if (quotaVm.hasSubdomain(quotaDto.domain)) {
        graph.subdomain =
          quotaGraphService.buildGraphDomainContainers(quotaDto, true);
      }

      return graph;
    }

    /**
     * @name buildGraphUpdate
     * @desc Update the graph depending on the type given
     * @param {string} type - Graph type to be built
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function buildGraphUpdate(type) {
      var quotaDto = {
        domain: quotaVm.domainQuotaDto,
        user: quotaVm.userQuotaDto,
        workgroup: quotaVm.workgroupQuotaDto,
        parentDomain : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.domainQuotaDto : quotaVm.parentDomainQuotaDto,
        parentUser : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.userQuotaDto : quotaVm.parentContainersQuotaDto.user,
        parentWorkgroup : quotaUtilsService.isRootDomain(domainQuotaDto) ?
          quotaVm.workgroupQuotaDto : quotaVm.parentContainersQuotaDto.workgroup
      };

      switch(type) {
      case 'user':
        quotaVm.graph.personalSpace =
          quotaGraphService.buildGraphContainer(quotaDto, 'PERSONAL_SPACE');
        break;
      case 'workgroup':
        quotaVm.graph.sharedSpace =
          quotaGraphService.buildGraphContainer(quotaDto, 'SHARED_SPACE');
        break;
      default:
        quotaVm.graph =  buildGraph();
        break;
      }

      if (_.contains(['user', 'workgroup'], type)) {
        quotaVm.graph.domainContainers =
          quotaGraphService.buildGraphDomainContainers(quotaDto);
        if (quotaVm.hasSubdomain(quotaDto.domain)) {
          quotaVm.graph.subdomain =
            quotaGraphService.buildGraphDomainContainers(quotaDto, true);
        }
      }
    }


    /**
     * @name getTemplate
     * @desc Return template of helper
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function getTemplate() {
      return 'QUOTA_DETAILS';
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
     * @name isInputDisabled
     * @desc Determine if the input shall be disabled
     * @param {String} name - desc
     * @returns {String} if there is one
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function isInputDisabled(linked) {
      if (quotaVm.isRootDomain(quotaVm.domainQuotaDto)) {
        return false;
      }
      return linked;
    }

    /**
     * @name manageOverride
     * @desc Invert bool value of override and set default value if true
     * @param {DOM Object} form - The form containing the element to be reset
     * @param {Object} element - Dto object triggering override
     * @param {Object} parent - Dto object parent of element
     * @param {string} property - Name of the property to be overridden
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function manageOverride(form, element, parent, property) {
      quotaUtilsService.manageOverride(element, parent, property);
      buildGraphUpdate(element.type ? element.type : element.route);
      quotaVm.formRender(form);
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
      quotaVm.formRender(form);
    }

    /**
     * @name setModelGetSet
     * @desc For each model containing property name referenced as keys in quotaVm.unit:
     *       Add a get and set function to take unit conversion into account while updating or requestion those values
     *       Also set the unit to be used, depending on the original object property value
     * @example
     *          domainQuotaDto.quota = 1000,
     *          domainQuotaDto.getQuota = function() {
     *            $filter('readableSize')(domainQuotaDto.quota.original, unit.domain.quota, false);
     *          }
     *          domainQuotaDto.setQuota = function(newValue, form) {
     *            unitService.toByte(newValue, unit.domain.quota);
     *            formRender(form);
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
        } else if (data.type){
          return data.type.toLowerCase().replace('_', '') === key;
        }
        return '';
      });
      _.forEach(Object.keys(quotaVm.unit[keyName]), function(propertyKey) {
        //TODO - KLE: Test to be removed once the back fill the missing fields in DTO
        quotaVm.unit[keyName][propertyKey] = (_.isUndefined(data[propertyKey]) || data[propertyKey] === null) ?
          'GB' : quotaVm.unitService.find(data[propertyKey]);
        data['get' + quotaVm.capitalize(propertyKey)] = function get(withUnit) {
          withUnit = withUnit || false;
          return $filter('readableSize')(data[propertyKey], quotaVm.unit[keyName][propertyKey], withUnit);
        };
        data['set' + quotaVm.capitalize(propertyKey)] = function set(newValue, form) {
          data[propertyKey] = quotaVm.unitService.toByte(newValue, quotaVm.unit[keyName][propertyKey]);
          //Need to reset the get function because on update of model, the function is replaced by the value
          data['get' + quotaVm.capitalize(propertyKey)] = function get(withUnit) {
            withUnit = withUnit || false;
            return $filter('readableSize')(data[propertyKey], quotaVm.unit[keyName][propertyKey], withUnit);
          };
          quotaVm.formRender(form);
        };

        /**
         * @name updateGraph
         * @desc Determine the graph to rebuild if no error in the form
         * @param {DOM Object} form - Form to evaluate
         * @memberOf linshareAdminApp.QuotaDetailController.setModelGetSet
         */
        data.updateGraph = function udpateGraph(form) {
          quotaVm.formRender(form).then(function(form) {
            if (!form.$invalid) {
              buildGraphUpdate(keyName);
            }
          });
        };
      });

      /**
       * @name isExceeded
       * @desc Determine if the current object quota has been exceeded
       * @memberOf linshareAdminApp.QuotaDetailController.setModelGetSet
       */
      data.isExceeded = function isExceeded() {
        var initDto = _.find(quotaVm.cloned, function(dto) {
          return dto.uuid === data.uuid;
        });
        return initDto.usedSpace >= initDto.quota;
      };

      if (_.has(data, 'quota') &&  _.has(data, 'usedSpace')) {
        data.remaining =
          data.quota - (data.usedSpace + _.has(data, 'currentValueForSubdomains') ? data.currentValueForSubdomains : 0);

        /**
         * @name getRemaining
         * @desc Retrieve the remaining quota of the current object
         * @param {boolean} [withUnit] - Determine if the unit shall also be returned with the value
         * @return  {number|string} The remaining quota
         * @memberOf linshareAdminApp.QuotaDetailController.setModelGetSet
         */
        data.getRemaining = function get(withUnit) {
          withUnit = withUnit || false;
          data.remaining =
                data.quota - (data.usedSpace +
                              _.has(data, 'currentValueForSubdomains') ? data.currentValueForSubdomains : 0);
          var unit = quotaVm.unitService.find(data.remaining);
          return $filter('readableSize')(data.remaining, unit, withUnit);
        };
      }

      if (_.has(data, 'quota') && _.has(data, 'defaultQuota')) {
        data.unallocated = _.has(data, 'currentValueForSubdomains') ?
          data.defaultQuota - data.quota : quotaVm.domainQuotaDto.quota - data.quota;
        data.unallocated = data.unallocated > 0 ? data.unallocated : 0;

        /**
         * @name getUnallocated
         * @desc Retrieve the unallocated quota of the current object
         * @param {boolean} [withUnit] - Determine if the unit shall also be returned with the value
         * @return {number|string} The unallocated quota
         * @memberOf linshareAdminApp.QuotaDetailController.setModelGetSet
         */
        data.getUnallocated = function get(withUnit) {
          withUnit = withUnit || false;
          data.unallocated = _.has(data, 'currentValueForSubdomains') ?
            data.defaultQuota - data.quota : quotaVm.domainQuotaDto.quota - data.quota;
          data.unallocated = data.unallocated > 0 ? data.unallocated : 0;
          var unit = quotaVm.unitService.find(data.unallocated);
          return $filter('readableSize')(data.unallocated, unit, withUnit);
        };
      }
    }

    /**
     * @name setParentDefault
     * @desc Reset domain quota to parent default value
     * @param {DOM Object} form - The form containing the element to be reset
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function setParentDefault(form) {
      quotaVm.setMatchingProperties(quotaVm.domainQuotaDto, 'Override', false);
      quotaVm.setMatchingProperties(quotaVm.userQuotaDto, 'Override', false);
      quotaVm.setMatchingProperties(quotaVm.workgroupQuotaDto, 'Override', false);
      quotaVm.domainQuotaDto.quota = quotaVm.parentDomainQuotaDto.defaultQuota;
      quotaVm.userQuotaDto.quota = quotaVm.parentContainersQuotaDto.user.defaultQuota;
      quotaVm.userQuotaDto.accountQuota = quotaVm.parentContainersQuotaDto.user.defaultAccountQuota;
      quotaVm.userQuotaDto.maxFileSize = quotaVm.parentContainersQuotaDto.user.defaultMaxFileSize;
      quotaVm.workgroupQuotaDto.quota = quotaVm.parentContainersQuotaDto.workgroup.defaultQuota;
      quotaVm.workgroupQuotaDto.maxFileSize = quotaVm.parentContainersQuotaDto.workgroup.defaultMaxFileSize;
      quotaVm.update(form);
    }

    /**
     * @name update
     * @desc Update Quota for domain & containers
     * @param {DOM Object} form - The form containing the element to be reset
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function update(form) {
      quotaRestService.updateDomain(_.omit(quotaVm.domainQuotaDto, ['remaining', 'unallocated']))
        .then(function(domainData) {
          initDto(domainData);
          return $q.all([
            quotaRestService.updateContainer(_.omit(quotaVm.userQuotaDto, ['remaining', 'unallocated'])),
            quotaRestService.updateContainer(_.omit(quotaVm.workgroupQuotaDto, ['remaining', 'unallocated']))
          ]);
        }).then(function(containersData) {
          Notification.addNotification('MANAGE_QUOTA.NOTIFICATION.UPDATE');
          _.forEach(containersData, function(containerData) {
            initDto(containerData);
            quotaVm.formRender(form);
          });
        }).catch(function(error) {
          Notification.addError(error);
        }).finally(function(){
          quotaVm.graph =  buildGraph();
        });
    }
  }
})();
