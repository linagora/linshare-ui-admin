'use strict';

angular.module('linshareAdminApp')
  .controller('UserDetailCtrl',
    ['$filter', '$log', '$modal', '$rootScope', '$scope', '$state', '$timeout', 'currentUser',
     'lsAppConfig', 'maxExpiryDate', 'quotaRestService', 'restrictedGuestStatus', 'selectOptions',
     'unitService', 'User',
    function ($filter, $log, $modal, $rootScope, $scope, $state, $timeout, currentUser, lsAppConfig,
              maxExpiryDate, quotaRestService, restrictedGuestStatus, selectOptions, unitService, User) {
        $scope.lsAppConfig = lsAppConfig;
        $scope.userRoles = selectOptions.userRoles;
        $scope.userRolesSimple = ['SIMPLE', 'ADMIN'];
        $scope.user = currentUser;

        //For quota management
        $scope.unit = {
          accounts: {
            quota: undefined,
            maxFileSize: undefined,
            usedSpace: undefined,
          },
          value: unitService.units
        };
        $scope.formParser = formParser;
        $scope.formRender = formRender;
        $scope.resetQuota = resetQuota;
        $scope.setParentDefault = setParentDefault;
        $scope.submitQuota = submitQuota;
        $scope.unitService = unitService;
        quotaRestService.getAccount($scope.user.quotaUuid).then(function(userData) {
          initDto(userData);
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
            if(elem.mail == contact.mail && elem.domain == contact.domain){
              exists = true;
              $log.info('The contact ' + contact.mail + ' has already been added to that guest\'s restricted contacts');
            }
          });
          if (!exists) {
            user.restrictedContacts.push(contact);
          }
        };
        $scope.userRepresentation = function (u) {
          return u.firstName.concat(" ", u.lastName, " ", u.mail, " ", u.domain);
        };
        $scope.searchGuestRestrictedContacts = function (pattern) {
          return User.autocomplete(pattern);
        };
        $scope.reset = function() {
          $state.reinit();
        };
        $scope.submit = function(user) {
          if (!$scope.user.restricted) {
            $scope.user.restrictedContacts = [];
          }
          User.update($scope.user);
        };
        $scope.isGuest = function() {
          return $scope.user.accountType == 'GUEST';
        };

        //To get the previous State to redirect to.
        if ($rootScope.routerState.current.name === 'user.detail') {
          $scope.goBackListBack = 'user.list';
        } else if ($rootScope.routerState.current.name === 'inconsistentuser.list.detail') {
          $scope.goBackListBack = 'inconsistentuser.list.all';
        } else {
          $scope.goBackListBack = 'inconsistentuser.search';
        }

        $scope.delete = function(user) {
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
                return Domain.getAll();
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
        }

        /**
         * @name capitalize
         * @desc Set the first letter of a string in upperCase
         * @param {string} value - Value to be capitalized
         * @returns {String} the value capitalize
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        //TODO - KLE : to be put in a util module
        function capitalize(value) {
          return value.charAt(0).toUpperCase() + value.substr(1);
        }

        /**
         * @name formParser
         * @desc Force parsers of element present in form
         * @param {DOM Object} form - The form containing the element to be parsed
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        //TODO - KLE : to be put in a util module
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
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        //TODO - KLE : to be put in a util module
        function formRender(form) {
          _.forEach(form, function(elm) {
            if (!_.isUndefined(elm.$render)) {
              elm.$render();
            }
          })
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
         * @name setModelGetSet
         * @desc For each model containing property name referenced as keys in $scope.unit:
         *       Add a get and set function to take unit conversion into account while updating or requestion those values
         *       Also set the unit to be used, depending on the original object property value
         * @example
         *          domainQuotaDto.quota = 1000,
         *          domainQuotaDto.getDomainsQuota = function() {
         *            $filter('readableSize')(domainQuotaDto.quota.original, unit.domain.quota, false)
         *          }
         *          domainQuotaDto.setDomainsQuota = function(newValue, form) {
         *            unitService.toByte(newValue, unit.domain.quota)
         *            $scope.formParser(form);
         *          }
         * @param {Object} data - Data used to find unit
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        //TODO: Need to update angular to 1.3 avoid this awful trick and use ng-model-options="{ getterSetter: true }"
        function setModelGetSet(data) {
          var keyName = _.find(Object.keys($scope.unit), function(key) {
            if (key === data.route) {
              return true;
            } else {
              return data.type.toLowerCase().replace('_', '') === key;
            }
          });
          _.forEach(Object.keys($scope.unit[keyName]), function(propertyKey) {
            //TODO - KLE: Test to be removed once the back fill the missing fields in DTO
            $scope.unit[keyName][propertyKey] = (_.isUndefined(data[propertyKey]) ||  data[propertyKey] === null) ? 'GB' : $scope.unitService.find(data[propertyKey]);
            data['get' + capitalize(keyName) + capitalize(propertyKey)] = function get() {
              return $filter('readableSize')(data[propertyKey], $scope.unit[keyName][propertyKey], false);
            };
            data['set' + capitalize(keyName) + capitalize(propertyKey)] = function set(newValue, form) {
              data[propertyKey] = $scope.unitService.toByte(newValue, $scope.unit[keyName][propertyKey]);
              $scope.formParser(form)
              //Need to reset the get function because on update of model, the function is replaced by the value
              data['get' + capitalize(keyName) + capitalize(propertyKey)] = function get() {
                return $filter('readableSize')(data[propertyKey], $scope.unit[keyName][propertyKey], false);
              };
            }
          });
          data.isExceeded = function isExceeded() {
            var initDto = _.find($scope.cloned, function(dto) {
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
         * @memberOf linshareAdminApp.UserDetailCtrl
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
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        function setParentDefault(form) {
          setMatchingProperties($scope.userQuotaDto, 'Override', false)
          $scope.submitQuota(form);
        }

        /**
         * @name submitQuota
         * @desc Update the user quota
         * @param {DOM Object} form - The form containing the element to be reset
         * @memberOf linshareAdminApp.UserDetailCtrl
         */
        function submitQuota(form) {
          quotaRestService.updateAccount($scope.userQuotaDto).then(function(userData) {
            initDto(userData);
            $scope.formParser(form);
            $scope.formRender(form);
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
          $scope.formParser(form);
          $scope.formRender(form);
        }
      }
    ]
  );
