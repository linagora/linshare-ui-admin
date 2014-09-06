'use strict';

angular.module('linshareAdminApp')
  .controller('UploadPropositionFilterDetailCtrl',
    ['$scope', '$state', '$log', 'selectOptions', 'UploadPropositionFilter', 'currentUploadPropositionFilter',
    function($scope, $state, $log, selectOptions, UploadPropositionFilter, currentUploadPropositionFilter) {
      $scope.filter = currentUploadPropositionFilter || {};
      $scope.state = $state.params.formState;
      $scope.fieldTypes = selectOptions.fieldTypes;
      $scope.operatorTypes = selectOptions.operatorTypes;
      $scope.actionTypes = selectOptions.actionTypes;
      $scope.matchTypes = selectOptions.matchTypes;
      if ($scope.state === 'create') {
        $scope.filter.uploadPropositionRules = [];
        $scope.filter.uploadPropositionActions = [];
        $scope.filter.uploadPropositionActions[0] = {};
        $scope.filter.match = 'TRUE'
      }

      $scope.addRule = function() {
        $scope.filter.uploadPropositionRules.push({});
      };
      $scope.deleteRule = function(index) {
        $scope.filter.uploadPropositionRules.splice(index, 1);
      };
      $scope.submit = function() {
        //$scope.filters.uploadPropositionRules = _.filter($scope.filters.uploadPropositionRules, function(obj) { return obj != {} ; });
        if ($scope.state === 'create') {
          UploadPropositionFilter.add($scope.filter).then(function () {
            $scope.cancel();
          });
        } else {
          UploadPropositionFilter.update($scope.filter).then(function () {
            $scope.cancel();
          });
        }
      };
      $scope.remove = function() {
        if ($scope.state != 'edit') {
          $log.error('Invalid state');
        }
        UploadPropositionFilter.remove($scope.filter).then(function() {
          $scope.cancel();
        });
      };
      $scope.cancel = function() {
        $state.go('uploadpropositionfilter.list');
      };
      $scope.reset = function() {
        $state.reinit();
      };
    }]
  );

