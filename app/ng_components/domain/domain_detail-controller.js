'use strict';

angular.module('linshareAdminApp')
  .controller('DomainDetailCtrl',
    ['_', '$rootScope', '$scope', '$log', '$modal', '$state', '$translate', 'Notification', 'selectOptions',
      'currentDomain', 'authenticatedUser', 'Domain', 'DomainPolicy', '_allWelcomeMessages', 'groupPatterns',
      '_allLdapConnections',
    // TODO: Should dispatch some function to other service or controller
    /* jshint maxparams: false */
    function(_, $rootScope, $scope, $log, $modal, $state, $translate, Notification, selectOptions, currentDomain,
      authenticatedUser, Domain, DomainPolicy, _allWelcomeMessages, groupPatterns, _allLdapConnections) {
      if (currentDomain) {
        $scope.state = $state.params.formState;
        $scope.ldapConnections = selectOptions.ldapConnectionIds;
        $scope.domainPolicy = false;
        $scope.mailConfigs = selectOptions.mailConfigs;
        $scope.mimePolicies = selectOptions.mimePolicies;
        $scope.userRoles = ['SIMPLE', 'ADMIN'];
        $scope.languages = selectOptions.languages;
        $scope.supportedLanguages = selectOptions.supportedLanguages;
        // To sort by 'name' with UnderscoreJs you'll need to convert the values in the same case
        $scope.welcomeMessages = _.sortBy(_allWelcomeMessages, function(welcomeMessage){
          return angular.lowercase(welcomeMessage.name);
        });
        $scope.domainPatterns = selectOptions.domainPatternIds;
        $scope.domainPolicies = [];
        angular.forEach(selectOptions.domainPolicies, function(domainPolicy) {
          this.push({identifier: domainPolicy.identifier, label: domainPolicy.label});
        }, $scope.domainPolicies);
        if ($scope.state === 'create') {
          var parentLabel = currentDomain.label;
          currentDomain = Domain.createSample(currentDomain.identifier, $state.params.domainType);
          $scope.parentDomain = angular.extend({label: parentLabel}, currentDomain);
        }
        $scope.domain = currentDomain;
        $scope.isSuperAdmin = authenticatedUser.role === 'SUPERADMIN';
        $scope.isRootDomain = currentDomain.type === 'ROOTDOMAIN';
        $scope.disableProvider = ($scope.isRootDomain || currentDomain.providers.length !== 0);
        $scope.disableGroupProvider = ($scope.isRootDomain ||
          (currentDomain.groupProviders && currentDomain.groupProviders.length !== 0));
        $scope.groupPatterns = _.map(groupPatterns.plain(), function(groupPattern) {
          return {
            uuid: groupPattern.uuid,
            label: groupPattern.label
          };
        });
        $scope.allLdapConnections = _.map(_allLdapConnections.plain(), function(ldapConnection) {
          return {
            uuid: ldapConnection.uuid,
            label: ldapConnection.label
          };
        });
      }
      $scope.addGroupProvider = addGroupProvider;
      $scope.deleteGroupProvider = deleteGroupProvider;

      /**
       * @name addGroupProvider
       * @desc Initialize and add group provider to domain object
       * @memberOf linshareAdminApp.DomainDetailCtrl
       */
      function addGroupProvider() {
        if (!$scope.disableGroupProvider) {
          $scope.domain.groupProviders = [{
            baseDn: '',
            automaticUserCreation: false,
            forceCreation: false
          }];
          $scope.disableGroupProvider = true;
        } else {
          $log.error('DomainDetailCtrl.addGroupProvider - Try to add more than one groups provider');
        }
      }
      
      /**
       * @name deleteGroupProvider
       * @desc Remove group provider from domain object
       * @memberOf linshareAdminApp.DomainDetailCtrl
       */
      function deleteGroupProvider() {
        if ($scope.disableGroupProvider) {
          $scope.domain.groupProviders.pop();
          $scope.disableGroupProvider = false;
        } else {
          $log.error('DomainDetailCtrl.deleteGroupProvider - Try to delete an non existing groups provider');
        }
      }
      
      $scope.addProvider = function() {
        if (!$scope.disableProvider) {
          $scope.domain.providers.push({
            ldapConnectionUuid: '',
            userLdapPatternUuid: '',
            baseDn: ''
          });
          $scope.disableProvider = true;
        } else {
          $log.error('Try to add more than one provider');
        }
      };
      $scope.deleteProvider = function() {
        if ($scope.disableProvider) {
          $scope.domain.providers.splice(0, 1);
          $scope.disableProvider = false;
        } else {
          $log.error('Try to delete an non existing provider');
        }
      };
   
      var createPolicy = function(label) {
        $scope.domainPolicy = {
          notification: false,
          label: label,
          accessPolicy: {
            rules: [{type: 'DENY_ALL'}]
          }
        };
        return DomainPolicy.add($scope.domainPolicy);
      };

      var addDomainWithPolicy = function(domain) {
        Domain.add(domain).then(function(newDomain) {
          $scope.domain.identifier = newDomain.identifier;
          DomainPolicy.get($scope.domain.policy.identifier).then(function(policy){
            policy.notification = false;
            policy.accessPolicy.rules.unshift({
              type: 'ALLOW',
              domain: $scope.domain
            });
            DomainPolicy.update(policy).then(function() {
              $state.go('domain.detail', {domainId: $scope.domain.identifier, formState: 'edit'});
            });
          });
          $state.go('domain.detail', {domainId: $scope.domain.identifier, formState: 'edit'});
        });
      };

      $scope.submit = function() {
        if ($scope.state === 'edit') {
          if($scope.domain.groupProviders[0]) {
            if(typeof $scope.domain.groupProviders[0].connection === 'string') {
              $scope.domain.groupProviders[0].connection = JSON.parse($scope.domain.groupProviders[0].connection);
            }
  
            if(typeof $scope.domain.groupProviders[0].pattern === 'string') {
              $scope.domain.groupProviders[0].pattern = JSON.parse($scope.domain.groupProviders[0].pattern);
            }
          }

          Domain.update($scope.domain);
        } else if ($scope.state === 'create') {
          if ($scope.domain.policy.identifier === 'create_new_policy') {
            createPolicy($scope.domain.label).then(function(newPolicy) {
              delete newPolicy.originalElement;
              $scope.domain.policy = newPolicy;
              addDomainWithPolicy($scope.domain);
            });
          } else {
            addDomainWithPolicy($scope.domain);
          }
        }
      };

      $scope.issetDomainPolicy = function(identifier){
        DomainPolicy.exist(identifier).then(function(res) {
          return res;
        });
      };
      $scope.remove = function() {
        if ($scope.state === 'edit') {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/common/confirm_modal.tpl.html',
            controller: 'ConfirmDialogCtrl',
            resolve: {
              content: function() {
                return 'MANAGE_DOMAINS.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              Domain.remove($scope.domain).then(function() {
                $scope.cancel();
              });
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        } else {
          $log.error('Invalid state');
        }
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.cancel = function() {
        $state.go('domain.detail', {domainId: null, formState: null, domainType: null}, {reload: true});
      };
    }]
  );
