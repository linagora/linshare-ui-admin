'use strict';

angular.module('linshareAdminApp').directive('lsInconsistentUserForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$modal', '$log', '$translate', 'Restangular', 'Domain', 'User',
        function($scope, $modal, $log, $translate, Restangular, Domain, User) {
          Domain.getAll(function successCallback(domains) {
            $scope.allDomains = domains;
          });
          $scope.$watch(User.getCurrent, function(newValue, oldValue) {
            if (angular.isDefined(newValue)) {
              $scope.user = Restangular.copy(newValue);
            }
          }, true);
          $scope.cancel = function() {
            User.setCurrent(undefined);
          };
          $scope.delete = function(user) {
            var modalInstance = $modal.open({
              templateUrl: '/views/templates/confirm_dialog.html',
              controller: 'ConfirmDialogCtrl',
              resolve: {
                content: function() {
                  return $translate('INCONSISTENT_USERS.CONFIRM_DELETE_FORM.PARAGRAPH');
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
            user.domain = domain.identifier;
            User.update($scope.user, function successCallback(user) {
              $scope.cancel();
            });
          };
        }
      ],
      templateUrl: '/views/templates/users/inconsistent_user_form.html',
      replace: false
    };
  }
]);
