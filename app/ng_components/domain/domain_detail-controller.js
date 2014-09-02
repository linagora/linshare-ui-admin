'use strict';

angular.module('linshareAdminApp')
  .controller('DomainDetailCtrl',
    ['$scope', '$log', '$modal', '$state', 'selectOptions', 'currentDomain', 'authenticatedUser', 'Domain',
    function($scope, $log, $modal, $state, selectOptions, currentDomain, authenticatedUser, Domain) {
      if (currentDomain) {
        $scope.ldapConnections = selectOptions.ldapConnectionIds;
        $scope.domainPatterns = selectOptions.domainPatternIds;
        $scope.domainPolicies = selectOptions.domainPolicyIds;
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
      $scope.submit = function() {
        if ($scope.state === 'edit') {
          Domain.update(
            $scope.domain,
            function successCallback() {
              $scope.cancel();
            }
          );
        } else if ($scope.state === 'create') {
          Domain.add(
            $scope.domain,
            function successCallback() {
              $scope.cancel();
            }
          );
        } else {
          $log.error('Invalid state');
        }
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
              Domain.remove(
                $scope.domain,
                function successCallback() {
                  $scope.cancel();
                }
              );
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
