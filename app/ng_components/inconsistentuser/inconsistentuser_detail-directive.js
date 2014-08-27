'use strict';

angular.module('linshareAdminApp').directive('lsInconsistentUserForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$modal', '$log', 'Domain', 'User',
        function($scope, $modal, $log, Domain, User) {
          Domain.getAll(function successCallback(domains) {
            $scope.allDomains = domains;
          });
          $scope.$watch(User.getCurrent, function(newValue, oldValue) {
            if (angular.isDefined(newValue)) {
              $scope.user = User.copyCurrent();
            }
          }, true);
          $scope.cancel = function() {
            User.setCurrent(undefined);
          };
          $scope.delete = function(user) {
            var modalInstance = $modal.open({
              templateUrl: 'ng_components/common/confirm_modal.tpl.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return 'INCONSISTENT_USERS.CONFIRM_DELETE_FORM.PARAGRAPH';
                }
              }
            });
            modalInstance.result.then(
              function validate() {
                User.remove($scope.user,
                  function successCallback(user) {
                    $scope.cancel();
                  }
                );
              }, function cancel() {
                $log.debug('Deletion modal dismissed');
              }
            );
          };
          $scope.submit = function(user, domain) {
            user.domain = Domain.getId(domain);
            User.update($scope.user, function successCallback(user) {
              $scope.cancel();
            });
          };
        }
      ],
      templateUrl: 'ng_components/inconsistentuser/inconsistentuser_detail.tpl.html',
      replace: false
    };
  }
]);
