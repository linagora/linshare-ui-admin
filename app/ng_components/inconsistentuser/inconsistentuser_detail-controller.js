'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserDetailCtrl',
    ['$scope', '$modal', '$log', '$state', 'User', 'allDomains', 'currentUser',
    function($scope, $modal, $log, $state, User, allDomains, currentUser) {
      $scope.allDomains = allDomains;
      $scope.user = currentUser;

      $scope.cancel = function() {
        $state.go('inconsistentuser.list'); 
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
        user.domain = domain;
        User.update($scope.user, function successCallback(user) {
          $scope.cancel();
        });
      };
    }]
  );

