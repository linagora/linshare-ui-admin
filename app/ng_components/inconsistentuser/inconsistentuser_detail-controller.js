'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserDetailCtrl',
    ['$scope', '$modal', '$log', '$state', 'User', 'allDomains', 'currentUser',
    function($scope, $modal, $log, $state, User, allDomains, currentUser) {
      $scope.allDomains = allDomains;
      $scope.user = currentUser;

      $scope.delete = function() {
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
            User.remove($scope.user).then(function() {
              $scope.cancel();
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.submit = function(user, domain) {
        user.domain = domain;
        User.update($scope.user).then(function() {
          $scope.cancel();
        });
      };
    }]
  );

