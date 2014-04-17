'use strict';

angular.module('linshareUiAdmin').directive('lsDomainPolicyForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$filter', '$modal', '$log', 'Restangular', 'ngTableParams', 'Enum', 'Domain', 'DomainPolicy', 'localize',
        function($scope, $filter, $modal, $log, Restangular, ngTableParams, Enum, Domain, DomainPolicy, localize) {
          Domain.getAll(function successCallback(domains) {
            $scope.allDomains = domains;
          });
          Enum.getOptions('domain_access_rule_type', function successCallback(ruleTypes) {
            $scope.allRuleTypes = ruleTypes;
          });
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              DomainPolicy.update(
                $scope.domainPolicy,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else if ($scope.state === 'create') {
              DomainPolicy.add(
                $scope.domainPolicy,
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
                templateUrl: '/views/templates/confirm_dialog.html',
                controller: 'ConfirmDialogCtrl',
                resolve: {
                  content: function() {
                    return localize.getLocalizedString(
                      'P_Domains-Policies_ConfirmDeleteText'
                    );
                  }
                }
              });
              modalInstance.result.then(
                function validate() {
                  DomainPolicy.remove(
                    $scope.domainPolicy,
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
          $scope.cancel = function() {
            DomainPolicy.setCurrent(undefined);
          };
          $scope.reset = function() {
            if (DomainPolicy.currentIsDefined()) {
              $scope.domainPolicy = Restangular.copy(DomainPolicy.getCurrent());
              if (angular.isDefined($scope.reloadList)) {
                $scope.reloadList();
              }
              if (_.isEmpty(DomainPolicy.getCurrent())) {
                $scope.state = 'create';
                $scope.domainPolicy.accessPolicy = {
                  'rules': []
                }
              } else {
                $scope.state = 'edit';
              }
            }
          };
          $scope.reset();
          $scope.addRule = function(ruleToAdd) {
            $scope.domainPolicy.accessPolicy.rules.push(ruleToAdd);
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
        }
      ],
      templateUrl: '/views/templates/domains/domain_policy_form.html',
      replace: false
    };
  }
]);
