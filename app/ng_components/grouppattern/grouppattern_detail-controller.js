'use strict';

angular.module('linshareAdminApp')
  .controller('GroupPatternDetailCtrl',
    ['$scope', '$state', '$modal', '$log', 'GroupPattern', 'models', 'currentGroupPattern',
    function($scope, $state, $modal, $log, GroupPattern, models, currentGroupPattern) {
      $scope.state = $state.params.formState;
      $scope.groupPattern = currentGroupPattern || {};
      if ($scope.state === 'create') {
        var emptyModel = GroupPattern.getEmptyModel();
        $scope.models = models;
        $scope.models.push(emptyModel);
        $scope.modelSelector = emptyModel;
        $scope.$watch('modelSelector', function() {
          loadModel();
        });
      }

      $scope.submit = function() {
        if ($scope.state === 'edit') {
          GroupPattern.update($scope.groupPattern);
          $state.go('grouppattern.list');
        } else if ($scope.state === 'create') {
          GroupPattern.add($scope.groupPattern).then(function() {
            $state.go('grouppattern.list');
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
                return 'GROUP_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              GroupPattern.remove($scope.groupPattern).then(function() {
                $state.go('grouppattern.list');
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
      function loadModel() {
        $scope.groupPattern = GroupPattern.copyFromModel($scope.modelSelector);
      }
    }]
  );

