'use strict';

app.directive('lsDomainPatternForm', [
  function() {
    return {
      restrict: 'A',
      scope: true,
      transclude: false,
      controller: 
        ['$scope', '$modal', '$log', 'DomainPattern', 'localize',
        function($scope, $modal, $log, DomainPattern, localize) {
          var emptyModel = {identifier: ''};
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              DomainPattern.update(
                $scope.domainPattern,
                function successCallback() {
                  $scope.reloadList();
                  $scope.switchView();
                }
              );
            } else {
              DomainPattern.add(
                $scope.domainPattern,
                function successCallback() {
                  $scope.reloadList();
                  $scope.switchView();
                }
              );
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
                      $scope.reloadList();
                      $scope.switchView();
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
            $scope.domainPattern = {};
            if (DomainPattern.currentIsDefined()) {
              console.log(DomainPattern.getCurrent());
              $scope.state = 'edit';
              angular.copy(DomainPattern.getCurrent(), $scope.domainPattern);
            } else {
              $scope.state = 'create';
              DomainPattern.getAllModels(function success(models) {
                $scope.models = models;
                $scope.models.push(emptyModel);
                $scope.modelSelector = emptyModel;
                $scope.$watch('modelSelector', function() {
                  loadModel();
                });
              });
            }
          };
          function loadModel() {
            angular.copy($scope.modelSelector, $scope.domainPattern);
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
