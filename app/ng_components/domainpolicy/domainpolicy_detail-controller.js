'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPolicyDetailCtrl',
    ['$scope', '$filter', '$modal', '$log', '$state', 'ngTableParams', 'DomainPolicy', 'selectOptions', 'currentDomainPolicy',
    function($scope, $filter, $modal, $log, $state, ngTableParams, DomainPolicy, selectOptions, currentDomainPolicy) {
      $scope.allDomains = selectOptions.domains;
      $scope.allRuleTypes = selectOptions.domainAccessRuleTypes;
      $scope.state = $state.params.formState;
      $scope.domainPolicy = currentDomainPolicy || {};
      if ($scope.state === 'create') {
        $scope.domainPolicy.accessPolicy = {
          'rules': []
        };
      }

      $scope.submit = function() {
        if ($scope.state === 'edit') {
          DomainPolicy.update($scope.domainPolicy).then(function() {
            $scope.cancel();
          });
        } else if ($scope.state === 'create') {
          DomainPolicy.add($scope.domainPolicy).then(function() {
            $scope.cancel();
          });
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
                return 'DOMAIN_POLICIES.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              DomainPolicy.remove($scope.domainPolicy).then(function() {
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
      $scope.cancel = function() {
        $state.go('domainpolicy.list');
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.addRule = function(ruleToAdd) {
        if (ruleToAdd.type === 'ALLOW_ALL' || ruleToAdd.type === 'DENY_ALL') {
          delete ruleToAdd.domain;
        }
        $scope.domainPolicy.accessPolicy.rules.push(angular.copy(ruleToAdd));
        $scope.reloadList();
      };
      $scope.deleteRule = function(index) {
        $scope.domainPolicy.accessPolicy.rules.splice(index, 1);
        $scope.reloadList();
      };
      $scope.swap = function(x, y) {
        var rules = $scope.domainPolicy.accessPolicy.rules;
        // Only Y could be out of range
        y = y % rules.length;
        // Swap values
        rules[x] = rules.splice(y, 1, rules[x])[0];
        $scope.reloadList();
      };
      $scope.reloadList = function () {
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
                              $filter('orderBy')($scope.domainPolicy.accessPolicy.rules, params.orderBy()) :
                              $scope.domainPolicy.accessPolicy.rules;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

