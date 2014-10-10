'use strict';

angular.module('linshareAdminApp')
  .controller('mailConfigModalCtrl',
    ['$scope', '$log', '$state', '$modalInstance', 'MailConfig',
      function ($scope, $log, $state, $modalInstance, MailConfig) {
        $scope.create = function () {
          MailConfig.add($scope.mailConfig).then(function() {
            $modalInstance.close();
            $scope.reset();
            $state.reinit();
          });
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.mailConfig = {
            visible: false,
            domain: $state.params.domainId
          };
        };
        $scope.reset();
      }
    ]
  );
