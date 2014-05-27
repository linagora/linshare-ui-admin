'use strict';

angular.module('linshareAdminApp')
  .controller('mimePolicyModalCtrl',
    ['$scope', '$log', '$modalInstance', 'Domain', 'MimePolicy',
      function ($scope, $log, $modalInstance, Domain, MimePolicy) {
        $scope.create = function () {
          console.log($scope.mimePolicy);
          MimePolicy.add($scope.mimePolicy,
            function successCallback(mimePolicy) {
              $modalInstance.close();
              $scope.reset();
            }
          );
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.mimePolicy = {
            domainId: Domain.getCurrentId()
          };
        };
        $scope.reset();
      }
    ]
  );
