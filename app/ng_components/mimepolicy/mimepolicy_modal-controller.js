'use strict';

angular.module('linshareAdminApp')
  .controller('mimePolicyModalCtrl',
    ['$scope', '$log', '$state', '$modalInstance', 'MimePolicy',
      function ($scope, $log, $state, $modalInstance, MimePolicy) {
        $scope.create = function () {
          MimePolicy.add($scope.mimePolicy).then(function() {
            $modalInstance.close();
            $state.reinit();
          });
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.mimePolicy = {
            domainId: $state.params.domainId
          };
        };
        $scope.reset();
      }
    ]
  );
