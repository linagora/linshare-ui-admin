'use strict';

angular.module('linshareAdminApp')
  .controller('mailConfigModalCtrl',
    ['$scope', '$log', '$modalInstance', 'Domain', 'MailConfig',
      function ($scope, $log, $modalInstance, Domain, MailConfig) {
        $scope.create = function () {
          console.log($scope.mailConfig);
          MailConfig.add($scope.mailConfig,
            function successCallback(mailConfig) {
              MailConfig.setCurrent(mailConfig);
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
          $scope.mailConfig = {
            visible: false,
            domain: Domain.getCurrentId()
          };
        };
        $scope.reset();
      }
    ]
  );
