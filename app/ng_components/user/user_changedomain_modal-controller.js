/**
 * Created by Alpha O. Sall on April 27th 2016.
 */

'use strict';

angular.module('linshareAdminApp')
  .controller('ChangeDomainModalCtrl',
  ['$scope', '$log', '$modalInstance', 'allDomains', 'User', 'selectedUsers',
    function ($scope, $log, $modalInstance, allDomains, User, selectedUsers) {
      $scope.allDomains = allDomains;
      $scope.validate = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      if(!angular.isArray(selectedUsers)) {
        selectedUsers = [selectedUsers];
      }
      $scope.selectedUsers = selectedUsers;

      $scope.submitDomain = function(selectedUsers, domain) {
        angular.forEach(selectedUsers, function(user, index) {
          user.domain = domain;
          if(user.isSelected) {
            user.isSelected = false;
          }
          User.updateInconsistent(_.omit(user, 'isSelected')).then(function() {
            selectedUsers.splice(index, 1);
            if (selectedUsers.length === 0) $modalInstance.close();
          });
        });

      }
    }
  ]
);
