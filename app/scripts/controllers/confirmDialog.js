'use strict';

angular.module('myApp.controllers')
  .controller('ConfirmDialogCtrl',
    ['$scope', '$sce', '$log', '$modalInstance', 'content',
      function ($scope, $sce, $log, $modalInstance, content) {
        $scope.content = $sce.trustAsHtml(content);
        $scope.validate = function () {
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    ]
  );
