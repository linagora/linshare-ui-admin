'use strict';

angular.module('linshareUiAdmin').directive('lsDomainPatternForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'Restangular', 'DomainPattern', 'localize',
        function($scope, $modal, $log, Restangular, DomainPattern, localize) {
          var emptyModel = {identifier: ''};
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
                templateUrl: '/views/templates/confirm_dialog.html',
                controller: 'ConfirmDialogCtrl',
                resolve: {
                  content: function() {
                    return localize.getLocalizedString(
                      'P_Domains-DomainPatterns_ConfirmDeleteText'
                    );
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
              $scope.domainPattern = Restangular.copy(DomainPattern.getCurrent());
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
            $scope.domainPattern = Restangular.copy($scope.modelSelector);
            $scope.domainPattern.identifier = "";
          };
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_pattern_form.html',
      replace: false
    };
  }
]);
