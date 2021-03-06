'use strict';

angular.module('linshareAdminApp')
  .controller('ConfirmDialogCtrl',
    ['$scope', '$log', '$modalInstance', 'content',
      function($scope, $log, $modalInstance, content) {
        $scope.content = content;
        $scope.validate = function() {
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      }
    ]
  );
