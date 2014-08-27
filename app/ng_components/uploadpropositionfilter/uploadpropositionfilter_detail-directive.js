'use strict';

angular.module('linshareAdminApp').directive('lsUploadPropositionFilterForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$log', 'Enum', 'UploadPropositionFilter',
        function($scope, $log, Enum, UploadPropositionFilter) {
          Enum.getOptions('upload_proposition_rule_field_type', function successCallback(fieldTypes) {
            $scope.fieldTypes = fieldTypes;
          });
          Enum.getOptions('upload_proposition_rule_operator_type', function successCallback(operatorTypes) {
            $scope.operatorTypes = operatorTypes;
          });
          Enum.getOptions('upload_proposition_action_type', function successCallback(actionTypes) {
            $scope.actionTypes = actionTypes;
          });
          Enum.getOptions('upload_proposition_match_type', function successCallback(matchTypes) {
            $scope.matchTypes = matchTypes;
          });
          $scope.addRule = function() {
            $scope.filter.uploadPropositionRules.push({});
          };
          $scope.deleteRule = function(index) {
            $scope.filter.uploadPropositionRules.splice(index, 1);
          };
          $scope.submit = function() {
            //$scope.filters.uploadPropositionRules = _.filter($scope.filters.uploadPropositionRules, function(obj) { return obj != {} ; });
            if ($scope.state === 'create') {
              UploadPropositionFilter.add($scope.filter, function () {
                $scope.cancel();
              });
            } else {
              UploadPropositionFilter.update($scope.filter, function () {
                $scope.cancel();
              });
            }
          };
          $scope.remove = function() {
            if ($scope.state != 'edit') {
              $log.error('Invalid state');
            }
            UploadPropositionFilter.remove($scope.filter, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            UploadPropositionFilter.setCurrent(undefined);
          };
          $scope.reset = function() {
            $scope.filter = UploadPropositionFilter.copyCurrent();
            if (_.isEmpty(UploadPropositionFilter.getCurrent())) {
              $scope.filter.uploadPropositionRules = [];
              $scope.filter.uploadPropositionActions = [];
              $scope.filter.uploadPropositionActions[0] = {};
              $scope.filter.match = 'TRUE'
              $scope.state = 'create';
            } else {
              $scope.state = 'edit';
            }
          };
          $scope.reset();
        }
      ],
      templateUrl: 'ng_components/uploadpropositionfilter/uploadpropositionfilter_detail.tpl.html',
      replace: false
    };
  }
]);
