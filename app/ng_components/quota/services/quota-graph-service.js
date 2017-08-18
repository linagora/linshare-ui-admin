/**
 * quotaGraphService Factory
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .factory('quotaGraphService', quotaGraphService);

  quotaGraphService.$inject = ['_', '$filter', 'graphService', 'quotaUtilsService', 'unitService'];

  /**
   * @namespace quotaGraphService
   * @desc Service to build & update quota graph
   * @memberOf linshareAdminApp
   */
  function quotaGraphService(_, $filter, graphService, quotaUtilsService, unitService) {

    var service = {
      buildGraphDomain: buildGraphDomain,
      buildGraphContainer: buildGraphContainer,
      buildGraphDomainContainers: buildGraphDomainContainers
    };

    return service;

    ////////////

    /**
     * @name buildGraphDomain
     * @desc Build graph of the current domain
     * @param {Object} quotaDto - Object for building graph, composed of different DTO
     * @returns {Object} A graph object
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function buildGraphDomain(quotaDto) {
      var
        domainQuotaDto = quotaDto.domain,
        parentDomainQuotaDto = quotaDto.parentDomain,
        workgroupQuotaDto = quotaDto.workgroup,
        userQuotaDto = quotaDto.user;

      return {
        colors: [graphService.colors.blue, graphService.colors.grey],
        ruler: {
          max : {
            display: quotaUtilsService.isRootDomain(domainQuotaDto) ?
              domainQuotaDto.getQuota(true) : parentDomainQuotaDto.getDefaultQuota(true),
            real: quotaUtilsService.isRootDomain(domainQuotaDto) ?
              domainQuotaDto.quota : parentDomainQuotaDto.defaultQuota
          },
          disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
        },
        containers: [
          {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.DOMAIN',
            label: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.DOMAIN',
            value: {
              display: domainQuotaDto.getUsedSpace(true),
              real: domainQuotaDto.usedSpace
            },
            areas: [
              {
                tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.USED.PERSONAL_SPACE',
                label: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SMALL.PERSONAL_SPACE',
                value: {
                  display: userQuotaDto.getUsedSpace(true),
                  real: userQuotaDto.usedSpace
                }
              }, {
                tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.USED.SHARED_SPACE',
                label: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SMALL.SHARED_SPACE',
                value: {
                  display: workgroupQuotaDto.getUsedSpace(true),
                  real: workgroupQuotaDto.usedSpace
                }
              }
            ],
            footer: true
          }, {
            colors: {
              border: graphService.colors.blue
            },
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.SUBDOMAIN',
            value: {
              display: domainQuotaDto.getCurrentValueForSubdomains(true),
              real: domainQuotaDto.currentValueForSubdomains
            },
            footer: true,
            disabled: !quotaUtilsService.hasSubdomain(domainQuotaDto)
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.REMAINING',
            value: {
              display: domainQuotaDto.getRemaining(true),
              real: domainQuotaDto.remaining
            },
            footer: domainQuotaDto.getQuota(true)
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.UNALLOCATED',
            value: {
              display: domainQuotaDto.getUnallocated(true),
              real: domainQuotaDto.unallocated
            },
            disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
          }
        ],
        chains: {
          value: domainQuotaDto.quotaOverride,
          position: !quotaUtilsService.isRootDomain(domainQuotaDto) ? parentDomainQuotaDto.defaultQuota : 0,
          tooltip: {
            enable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.RESET',
            disable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.UNLINK',
            param: !quotaUtilsService.isRootDomain(domainQuotaDto) ? parentDomainQuotaDto.getDefaultQuota(true) : 0
          },
          disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
        }
      };
    }

    /**
     * @name buildGraphContainer
     * @desc Build graph of a Container
     * @param {Object} quotaDto - Object for building graph, composed of different DTO
     * @param {string} label - Label of the container, serve as a suffix for some translation key
     * @returns {Object} A graph object
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function buildGraphContainer(quotaDto, label) {
      var
        colors,
        domainQuotaDto = quotaDto.domain,
        element,
        parent;

      if (label === 'PERSONAL_SPACE') {
        colors = graphService.colors.purple;
        element = quotaDto.user;
        parent = quotaDto.parentUser;
      } else {
        colors = graphService.colors.green;
        element = quotaDto.workgroup;
        parent = quotaDto.parentWorkgroup;
      }
      return {
        colors: colors,
        ruler: {
          max : {
            display: domainQuotaDto.getQuota(true),
            real: domainQuotaDto.quota
          }
        },
        containers: [
          {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.USED',
            label: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.' + label,
            value: {
              display: element.getUsedSpace(true),
              real: element.usedSpace
            },
            footer: true
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.REMAINING',
            value: {
              display: element.getRemaining(true),
              real: element.remaining
            },
            //dynamic: {
            //  tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.CLICK.DEFAULT'
            //},
            footer: element.getQuota(true)
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.UNALLOCATED',
            value: {
              display: element.getUnallocated(true),
              real: element.unallocated
            }
          }],
        chains: {
          value: element.quotaOverride,
          position: parent.defaultQuota,
          tooltip: {
            enable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.RESET',
            disable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.UNLINK',
            param: parent.getDefaultQuota(true)
          },
          disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
        }
      };
    }

    /**
     * @name buildGraphDomainContainers
     * @desc Build graph Containers
     * @param {Object} quotaDto - Object for building graph, composed of different DTO
     * @param {boolean} dynamic - Determine if the graph is a dynamic one & set related property
     * @returns {Object} A graph object
     * @memberOf linshareAdminApp.QuotaDetailController
     */
    function buildGraphDomainContainers(quotaDto, dynamic) {
      var
        domainQuotaDto = quotaDto.domain,
        workgroupQuotaDto = quotaDto.workgroup,
        parentWorkgroupQuotaDto = quotaDto.parentWorkgroup,
        userQuotaDto = quotaDto.user,
        parentUserQuotaDto = quotaDto.parentUser;

      var graph = {
        colors: [graphService.colors.purpleStripes, graphService.colors.greenStripes],
        ruler: {
          max : {
            colors: graphService.colors.orange,
            display: domainQuotaDto.getQuota() * 2 + quotaUtilsService.unit.domains.quota,
            real: domainQuotaDto.quota * 2
          }
        },
        limit : {
          value: domainQuotaDto.getQuota(true),
          labels: {
            middle: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.OVER',
            max:  'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.MAX'
          }
        },
        containers: [
          {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.PERSONAL_SPACE',
            value: {
              display: userQuotaDto.getQuota(true),
              real: userQuotaDto.quota
            }
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.SHARED_SPACE',
            value: {
              display: workgroupQuotaDto.getQuota(true),
              real: workgroupQuotaDto.quota
            }
          }, {
            legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.UNALLOCATED',
            value: {
              display: function () {
                var value = dynamic ?
                      domainQuotaDto.defaultQuota * 2 - (userQuotaDto.defaultQuota + workgroupQuotaDto.defaultQuota) :
                      domainQuotaDto.quota * 2 - (userQuotaDto.quota + workgroupQuotaDto.quota);
                var unit = unitService.find(value);
                return $filter('readableSize')(value, unit, true);
              },
              real: domainQuotaDto.quota * 2 - (userQuotaDto.quota + workgroupQuotaDto.quota)
            }
          }
        ]
      };

      if (!dynamic) {
        _.assign(graph.containers[0],{
          colors: {
            border: graphService.colors.blue,
            label: graphService.colors.blue
          },
          label: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.DISTRIBUTION',
          footer: true
        });
        _.assign(graph.containers[1],{
          colors: {
            border: graphService.colors.blue,
            label: graphService.colors.blue
          },
          footer: function () {
            var value = userQuotaDto.quota + workgroupQuotaDto.quota;
            var unit = unitService.find(value);
            return $filter('readableSize')(value, unit, true);
          }
        });
      } else {
        _.assign(graph.ruler.max, {
          display: domainQuotaDto.getDefaultQuota() * 2 + quotaUtilsService.unit.domains.defaultQuota,
          real: domainQuotaDto.defaultQuota * 2
        });
        _.assign(graph.limit, {
          value: domainQuotaDto.getDefaultQuota(true)
        });
        _.assign(graph.containers[0],{
          value: {
            display: userQuotaDto.getDefaultQuota(true),
            real: userQuotaDto.defaultQuota
          }
          //dynamic: {
          //  tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.CLICK.PERSONAL_SPACE'
          //}
        });
        _.assign(graph.containers[1],{
          value: {
            display: workgroupQuotaDto.getDefaultQuota(true),
            real: workgroupQuotaDto.defaultQuota
          }
          //dynamic: {
          //  tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.CLICK.SHARED_SPACE'
          //}
        });
        _.assign(graph.containers[2],{
          legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.UNASSIGNED'
        });
        _.assign(graph.containers[2].value, {
          real: domainQuotaDto.defaultQuota * 2 - (userQuotaDto.defaultQuota + workgroupQuotaDto.defaultQuota)
        });
        _.assign(graph, {
          chains: [
            {
              value: userQuotaDto.defaultQuotaOverride,
              position: parentUserQuotaDto.defaultQuota,
              tooltip: {
                enable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.RESET',
                disable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.UNLINK',
                param: parentUserQuotaDto.getDefaultQuota(true)
              },
              disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
            }, {
              value: workgroupQuotaDto.defaultQuotaOverride,
              position: parentUserQuotaDto.defaultQuota + parentWorkgroupQuotaDto.defaultQuota,
              tooltip: {
                enable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.RESET',
                disable: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.UNLINK',
                param: parentWorkgroupQuotaDto.getDefaultQuota(true)
              },
              disabled: quotaUtilsService.isRootDomain(domainQuotaDto)
            }
          ]
        });
      }
      return graph;
    }
  }
})();
