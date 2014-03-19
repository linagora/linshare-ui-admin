'use strict';

app.directive('lsDomainForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: true,
      controller: ['$scope', '$modal', '$log', 'Domain',
        function($scope, $modal, $log, Domain) {
          $scope.addProvider = function() {
            $scope.domain.providers.push({
              ldapConnectionId: '',
              domainPatternId: '',
              baseDn: ''
            });
          };
          $scope.deleteProvider = function() {
            $scope.domain.providers.splice(0, 1);
          }
          $scope.submit = function() {
            if ($scope.state === 'edit') {
              Domain.update(
                $scope.domain,
                function successCallback() {
                  $scope.reload();
                }
              );
            } else {
              Domain.add(
                $scope.domain,
                function successCallback() {
                  $scope.reload();
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
                      'P_Domains-Management_ConfirmDeleteText'
                    );
                  }
                }
              });
              modalInstance.result.then(
                function validate() {
                  Domain.remove(
                    domain,
                    function successCallback() {
                      $scope.reload();
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
            $scope.reload();
          };
          $scope.reset = function() {
            $scope.domain = angular.copy(Domain.getCurrent());
          };
          $scope.$watch(Domain.getCurrent,
            function(newValue, oldValue) {
              if (newValue && newValue !== oldValue) {
                $scope.reset();
              }
            },
            true
          );

          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_form.html',
      replace: false
    };
  }
]);
