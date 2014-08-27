'use strict';

angular.module('linshareAdminApp').directive('lsDomainPatternForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'DomainPattern',
        function($scope, $modal, $log, DomainPattern) {
          var emptyModel = DomainPattern.getEmptyModel();
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              DomainPattern.update(
                $scope.domainPattern,
                function successCallback() {
                  $scope.cancel();
                }
              );
            } else if ($scope.state === 'create') {
              DomainPattern.add(
                $scope.domainPattern,
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
                    return 'DOMAIN_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH';
                  }
                }
              });
              modalInstance.result.then(
                function validate() {
                  DomainPattern.remove(
                    $scope.domainPattern,
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
            DomainPattern.setCurrent(undefined);
          };
          $scope.reset = function() {
            if (DomainPattern.currentIsDefined()) {
              $scope.domainPattern = DomainPattern.copyCurrent();
              if (_.isEmpty(DomainPattern.getCurrent())) {
                $scope.state = 'create';
                DomainPattern.getAllModels(function success(models) {
                  $scope.models = models;
                  $scope.models.push(emptyModel);
                  $scope.modelSelector = emptyModel;
                  $scope.$watch('modelSelector', function() {
                    loadModel();
                  });
                });
              } else {
                $scope.state = 'edit';
              }
            }
          };
          function loadModel() {
            $scope.domainPattern = DomainPattern.copyFromModel($scope.modelSelector);
          };
          $scope.reset();
        }
      ],
      templateUrl: 'ng_components/domainpattern/domainpattern_detail.tpl.html',
      replace: false
    };
  }
]);
