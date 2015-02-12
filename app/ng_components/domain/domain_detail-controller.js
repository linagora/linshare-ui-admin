'use strict';

angular.module('linshareAdminApp')
  .controller('DomainDetailCtrl',
    ['$rootScope', '$scope', '$log', '$modal', '$state', '$translate', 'Notification', 'selectOptions', 'currentDomain', 'authenticatedUser', 'Domain', 'DomainPolicy',
    function($rootScope, $scope, $log, $modal, $state, $translate, Notification, selectOptions, currentDomain, authenticatedUser, Domain, DomainPolicy) {
      if (currentDomain) {
        $scope.ldapConnections = selectOptions.ldapConnectionIds;
        $scope.domainPatterns = selectOptions.domainPatternIds;
        $scope.domainPolicies = [];
        angular.forEach(selectOptions.domainPolicyIds, function(value, key) {
          this.push({value: value, name: value});
        }, $scope.domainPolicies);
        $scope.domainPolicies.splice(0, 0, {value:'cb621f5f-e5cd-42e7-b704-1f5b46fe50da', name: 'SELECT_OPTION_POLICY'});
        $translate('MANAGE_DOMAINS.CREATE_FORM.SELECT_OPTION_POLICY')
          .then(function (translatedValue) {
              $scope.domainPolicies[0].name = translatedValue;
        });
        $rootScope.$on('$translateChangeSuccess', function() {
          $translate('MANAGE_DOMAINS.CREATE_FORM.SELECT_OPTION_POLICY')
            .then(function (translatedValue) {
                $scope.domainPolicies[0].name = translatedValue;
          });
        });
        $scope.domainPolicy = false;
        $scope.mailConfigs = selectOptions.mailConfigs;
        $scope.mimePolicies = selectOptions.mimePolicies;
        $scope.userRoles = selectOptions.userRoles;
        $scope.languages = selectOptions.languages;
        $scope.state = $state.params.formState;
        if ($scope.state === 'create') {
          currentDomain = Domain.createSample(currentDomain.identifier, $state.params.domainType);
        }
        $scope.domain = currentDomain;
        $scope.isSuperAdmin = authenticatedUser.role === 'SUPERADMIN';
        $scope.isRootDomain = currentDomain.type === 'ROOTDOMAIN';
        $scope.disableProvider = ($scope.isRootDomain || currentDomain.providers.length != 0);
      }

      $scope.addProvider = function() {
        if (!$scope.disableProvider) {
          $scope.domain.providers.push({
            ldapConnectionId: '',
            domainPatternId: '',
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
      }
      $scope.submit = function(creation) {
        $scope.policyIsCreate = typeof creation !== 'undefined' ? creation : false;
        if ($scope.state === 'edit') {
          Domain.update($scope.domain).then(function() {
            $scope.cancel();
          });
        } else if ($scope.state === 'create') {
          if ($scope.domain.policy.identifier == "cb621f5f-e5cd-42e7-b704-1f5b46fe50da"){
            var id = $scope.domain.identifier + "-policy"
            $scope.domain.policy.identifier = id;
            $scope.createPolicy(id);
            return ;
          }
          Domain.add($scope.domain).then(function() {
            if ($scope.policyIsCreate)
            {
              DomainPolicy.get($scope.domainPolicy.identifier).then(function(policy){
                policy.notification = false;
                policy.accessPolicy.rules.unshift({
                  type: "ALLOW",
                  domain: $scope.domain
                });
                DomainPolicy.update(policy).then(function() {
                  $state.go("domain.detail", {domainId: $scope.domain.identifier, formState: 'edit'});
                });
              });
            }
            $state.go("domain.detail", {domainId: $scope.domain.identifier, formState: 'edit'});
          });
        } else {
          $log.error('Invalid state');
        }
      };
      $scope.createPolicy = function(id){
        $scope.domainPolicy = {};
        $scope.domainPolicy.notification = false;
        $scope.domainPolicy.identifier = id;
        $scope.domainPolicy.accessPolicy = {
          'rules': []
        };
        $scope.domainPolicy.accessPolicy.rules.push({type: "DENY_ALL"});
        DomainPolicy.exist($scope.domainPolicy.identifier).then(function(res) {
          if (res == false){
            DomainPolicy.add($scope.domainPolicy).then(function() {
              $scope.submit(true);
            });
          }else{
            Notification.addError({errCode : '13009'});
          }
        });
      };
      $scope.issetDomainPolicy = function(identifier){
        DomainPolicy.exist(identifier).then(function(res) {
          return res;
        })
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
  )
