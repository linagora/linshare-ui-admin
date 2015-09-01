'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPatternDetailCtrl',
    ['$scope', '$state', '$modal', '$log', 'DomainPattern', 'models', 'currentDomainPattern',
    function($scope, $state, $modal, $log, DomainPattern, models, currentDomainPattern) {
      $scope.state = $state.params.formState;
      $scope.domainPattern = currentDomainPattern || {};
      if ($scope.state === 'create') {
        var emptyModel = DomainPattern.getEmptyModel();
        $scope.models = models;
        $scope.models.push(emptyModel);
        $scope.modelSelector = emptyModel;
        $scope.$watch('modelSelector', function() {
          loadModel();
        });
      }

      $scope.submit = function() {
        if ($scope.state === 'edit') {
          DomainPattern.update($scope.domainPattern);
        } else if ($scope.state === 'create') {
          DomainPattern.add($scope.domainPattern).then(function() {
            $state.go('domainpattern.list');
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
                return 'DOMAIN_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              DomainPattern.remove($scope.domainPattern).then(function() {
                $state.go('domainpattern.list');
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
        $scope.domainPattern = DomainPattern.copyFromModel($scope.modelSelector);
      };
    }]
  );

