'use strict';

angular.module('linshareAdminApp')
  .controller('UserDetailCtrl',
              ['_', '$filter', '$log', '$modal', '$rootScope', '$scope', '$state', '$timeout', 'currentUser',
               'graphService', 'lsAppConfig', 'maxExpiryDate', 'quotaRestService', 'quotaUtilsService',
               'restrictedGuestStatus', 'selectOptions', 'unitService', 'User',
               /* jshint maxparams: false */
               function(_, $filter, $log, $modal, $rootScope, $scope, $state, $timeout, currentUser, graphService,
                        lsAppConfig, maxExpiryDate, quotaRestService, quotaUtilsService, restrictedGuestStatus,
                        selectOptions, unitService, User) {
        $scope.lsAppConfig = lsAppConfig;
        $scope.userRoles = selectOptions.userRoles;
        $scope.userRolesSimple = ['SIMPLE', 'ADMIN'];
        $scope.user = currentUser;

        //For quota management
        $scope.unit = quotaUtilsService.unit;
        $scope.unit.value = _.map(unitService.units, function(unit) {
          return unit.value;
        });
        $scope.buildGraph = buildGraph;
        $scope.formRender = quotaUtilsService.formRender;
        $scope.manageOverride = manageOverride;
        $scope.resetQuota = resetQuota;
        $scope.setParentDefault = setParentDefault;
        $scope.submitQuota = submitQuota;
        $scope.unitService = unitService;
        quotaRestService.getAccount($scope.user.quotaUuid).then(function(userData) {
          initDto(userData);
          $scope.graph = buildGraph();
          $scope.isGraphReady = true;
        });

        $scope.limit = maxExpiryDate;
        $scope.restrictedDisabled = restrictedGuestStatus;
        $scope.selectEnumLanguage = selectOptions.selectEnumLanguage;
        $scope.selectMailLanguage = selectOptions.selectMailLanguage;

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.opened = true;
        };
        $scope.removeContact = function(user, index) {
          user.restrictedContacts.splice(index, 1);
        };
        $scope.addContact = function(user, contact) {
          var exists = false;
          angular.forEach(user.restrictedContacts, function(elem) {
            if(elem.mail === contact.mail && elem.domain === contact.domain){
              exists = true;
              $log.info('The contact ' + contact.mail + ' has already been added to that guest\'s restricted contacts');
            }
          });
          if (!exists) {
            user.restrictedContacts.push(contact);
          }
        };
        $scope.userRepresentation = function(u) {
          return u.firstName.concat(' ', u.lastName, ' ', u.mail, ' ', u.domain);
        };
        $scope.searchGuestRestrictedContacts = function(pattern) {
          return User.autocomplete(pattern);
        };
        $scope.reset = function() {
          $state.reinit();
        };
        $scope.submit = function() {
          if (!$scope.user.restricted) {
            $scope.user.restrictedContacts = [];
          }
          User.update($scope.user);
        };
        $scope.isGuest = function() {
          return $scope.user.accountType === 'GUEST';
        };

        //To get the previous State to redirect to.
        if ($rootScope.routerState.current.name === 'user.detail') {
          $scope.goBackListBack = 'user.list';
        } else if ($rootScope.routerState.current.name === 'inconsistentuser.list.detail') {
          $scope.goBackListBack = 'inconsistentuser.list.all';
        } else {
          $scope.goBackListBack = 'inconsistentuser.search';
        }

        $scope.delete = function() {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/common/confirm_modal.tpl.html',
            controller: 'ConfirmDialogCtrl',
            resolve: {
              content: function() {
                return 'MANAGE_USERS.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              User.remove($scope.user).then(function() {
                $scope.$parent.dataUpTodate = false;
                $state.go($scope.goBackListBack);
              });
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        };

        $scope.changeDomain = function(selectedUsers) {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/user/user_changedomain_modal.tpl.html',
            controller: 'ChangeDomainModalCtrl',
            resolve: {
              allDomains: function(Domain) {
                return Domain.getAll().then(function(allDomains) {
                  return allDomains.filter(isUnassignableDomain);
                });
              },
              selectedUsers: function() {
                return selectedUsers;
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              $scope.$parent.dataUpTodate = false;
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        };

      /**
       * @name buildGraph
       * @desc Build quota graph
       * @returns {Object} A graph object
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function buildGraph() {
        return {
          colors: [graphService.colors.blue, graphService.colors.blueStripes],
          ruler: {
            max : {
              display: $scope.userQuotaDto.getQuota(true),
              real: $scope.userQuotaDto.getQuota()
            }
          },
          containers: [
            {
              legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.SPACE.USED',
              value: {
                display: $scope.userQuotaDto.getUsedSpace(true),
                real: $scope.userQuotaDto.usedSpace
              }
            }, {
              legend: 'MANAGE_QUOTA.BOX_FORM.GRAPH.LEGEND.QUOTA.REMAINING',
              value: {
                display: $scope.userQuotaDto.getRemaining(true),
                real: $scope.userQuotaDto.remaining
              }
              //dynamic: {
              //  tooltip: 'MANAGE_QUOTA.BOX_FORM.GRAPH.TOOLTIP.CLICK.DEFAULT'
              //},
            }]
        };
      }

      /**
       * @name initDto
       * @desc Initialise DTO element by cloning them and adding get/set
       * @param {Object} data - Server response data
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function initDto(data) {
        $scope.userQuotaDto = data;
        $scope.userQuotaDtoCloned = _.cloneDeep(data);
        $scope.unitCloned = _.cloneDeep($scope.unit);
        setModelGetSet(data);
      }

      /**
       * @name manageOverride
       * @desc Invert bool value of override and set default value if true
       * @param {DOM Object} form - The form containing the element to be reset
       * @param {Object} element - Dto object triggering override
       * @param {string} property - Name of the property to be overridden
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function manageOverride(form, element, property) {
        quotaUtilsService.manageOverride(element, element, property);
        $scope.formRender(form).then(function(form) {
          if (!form.$invalid) {
            $scope.buildGraph();
          }
        });
      }

      /**
       * @name setModelGetSet
       * @desc For each model containing property name referenced as keys in $scope.unit:
       *       Add a get and set function to take unit conversion into account while updating or
       *       requesting those values
       *       Also set the unit to be used, depending on the original object property value
       * @example
       *          domainQuotaDto.quota = 1000,
       *          domainQuotaDto.getDomainsQuota = function() {
       *            $filter('readableSize')(domainQuotaDto.quota.original, unit.domain.quota, false)
       *          }
       *          domainQuotaDto.setDomainsQuota = function(newValue, form) {
       *            unitService.toByte(newValue, unit.domain.quota)
       *            $scope.formRender(form);
       *          }
       * @param {Object} data - Data used to find unit
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      //TODO: Need to update angular to 1.3 avoid this awful trick and use ng-model-options="{ getterSetter: true }"
      function setModelGetSet(data) {
        var keyName = _.find(Object.keys($scope.unit), function(key) {
          if (key === data.route) {
            return true;
          } else if (data.type) {
            return data.type.toLowerCase().replace('_', '') === key;
          }
          return '';
        });
        _.forEach(Object.keys($scope.unit[keyName]), function(propertyKey) {
          //TODO - KLE: Test to be removed once the back fill the missing fields in DTO
          $scope.unit[keyName][propertyKey] = (_.isUndefined(data[propertyKey]) || data[propertyKey] === null) ?
            'GB' : $scope.unitService.find(data[propertyKey]);
          data['get' + quotaUtilsService.capitalize(propertyKey)] =
            function get(withUnit) {
              return $filter('readableSize')(data[propertyKey], $scope.unit[keyName][propertyKey], withUnit);
            };
          data['set' + quotaUtilsService.capitalize(propertyKey)] =
            function set(newValue, form) {
              data[propertyKey] = $scope.unitService.toByte(newValue, $scope.unit[keyName][propertyKey]);
              //Need to reset the get function because on update of model, the function is replaced by the value
              data['get' + quotaUtilsService.capitalize(propertyKey)] =
                function get(withUnit) {
                  return $filter('readableSize')(data[propertyKey], $scope.unit[keyName][propertyKey], withUnit);
                };
              $scope.formRender(form);
            };

          /**
           * @name updateGraph
           * @desc Determine the graph to rebuild if no error in the form
           * @param {DOM Object} form - Form to evaluate
           * @memberOf linshareAdminApp.UserDetailCtrl.setModelGetSet
           */
          data.updateGraph = function udpateGraph(form) {
            $scope.formRender(form).then(function(form) {
              if (!form.$invalid) {
                $scope.graph = buildGraph();
              }
            });
          };
        });

        /**
         * @name isExceeded
         * @desc Determine if the current object quota has been exceeded
         * @memberOf linshareAdminApp.UserDetailCtrl.setModelGetSet
         */
        data.isExceeded = function isExceeded() {
          var initDto = _.find($scope.cloned, function(dto) {
            return dto.uuid === data.uuid;
          });
          return initDto.usedSpace >= initDto.quota;
        };

        data.remaining = data.quota - data.usedSpace;

        /**
         * @name getRemaining
         * @desc Retrieve the remaining quota of the current object
         * @param {boolean} [withUnit] - Determine if the unit shall also be returned with the value
         * @return  {number|string} The remaining quota
         * @memberOf linshareAdminApp.UserDetailCtrl.setModelGetSet
         */
        data.getRemaining = function get(withUnit) {
          withUnit = withUnit || false;
          data.remaining = data.quota - data.usedSpace;
          var unit = $scope.unitService.find(data.remaining);
          return $filter('readableSize')(data.remaining, unit, withUnit);
        };

        data.unallocated = data.defaultQuota - data.quota;
        data.unallocated = data.unallocated > 0 ? data.unallocated : 0;

        /**
         * @name getUnallocated
         * @desc Retrieve the unallocated quota of the current object
         * @param {boolean} [withUnit] - Determine if the unit shall also be returned with the value
         * @return {number|string} The unallocated quota
         * @memberOf linshareAdminApp.UserDetailCtrl.setModelGetSet
         */
        data.getUnallocated = function get(withUnit) {
          withUnit = withUnit || false;
          data.unallocated = data.defaultQuota - data.quota;
          data.unallocated = data.unallocated > 0 ? data.unallocated : 0;
          var unit = $scope.unitService.find(data.unallocated);
          return $filter('readableSize')(data.unallocated, unit, withUnit);
        };
      }

      /**
       * @name setParentDefault
       * @desc Reset domain quota to parent default value
       * @param {DOM Object} form - The form containing the element to be reset
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function setParentDefault(form) {
        quotaUtilsService.setMatchingProperties($scope.userQuotaDto, 'Override', false);
        $scope.userQuotaDto.quota = $scope.userQuotaDto.defaultQuota;
        $scope.userQuotaDto.maxFileSize = $scope.userQuotaDto.defaultMaxFileSize;
        $scope.submitQuota(form);
      }

      /**
       * @name submitQuota
       * @desc Update the user quota
       * @param {DOM Object} form - The form containing the element to be reset
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function submitQuota(form) {
        quotaRestService.updateAccount(_.omit($scope.userQuotaDto, ['remaining', 'unallocated']))
          .then(function(userData) {
            initDto(userData);
            $scope.formRender(form);
          }).then(function() {
              $scope.graph = buildGraph();
          });
      }

      /**
       * @name resetQuota
       * @desc Reset quota form to initial state
       * @param {DOM Object} form - The form containing the element to be reset
       * @memberOf linshareAdminApp.UserDetailCtrl
       */
      function resetQuota(form) {
        $scope.userQuotaDto = _.cloneDeep($scope.userQuotaDtoCloned);
        $scope.unit = _.cloneDeep($scope.unitCloned);
        setModelGetSet($scope.userQuotaDto);
        $scope.formRender(form).then(function() {
          $scope.graph = buildGraph();
        });
      }

      function isUnassignableDomain(domain) {
        if (domain.type !== 'ROOTDOMAIN' && domain.type !== 'GUESTDOMAIN') {
          return domain;
        }
      }

      }
    ]
  );
