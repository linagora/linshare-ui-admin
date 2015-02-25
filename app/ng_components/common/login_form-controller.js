'use strict';

var LoginModalInstanceCtrl =
[ '$scope',
  '$timeout',
  '$modalInstance',
  'Authentication',
  function ($scope, $timeout, $modalInstance, Authentication) {
    // Need this variable to store modal inputs
    // because of Javascript's prototypical inheritance
    $scope.input = {};

    $scope.$on('event:auth-loginRequired', function() {
      $scope.errorLogin = Authentication.isWaitingForResponse();
      $timeout(function() {
        $scope.errorLogin = false;
      }, 2000);
    });

    $scope.submit = function() {
      Authentication.request($scope.input.login, $scope.input.password);
    };

    this.close = function() {
      $modalInstance.close();
    };
  }
];

angular.module('linshareAdminApp').controller('LoginFormCtrl',
['$scope', '$log', '$modal',
  function($scope, $log, $modal) {
    var modalInstance;
    $scope.$on('event:auth-loginRequired', function() {
      $log.debug('event:auth-loginRequired received');
      if (angular.isUndefined(modalInstance)) {
        modalInstance = $modal.open({
          backdrop: 'static',
          controller: LoginModalInstanceCtrl,
          templateUrl: 'ng_components/common/login_form.tpl.html'
        });
      }
    });
    $scope.$on('event:auth-loginConfirmed', function() {
      $log.debug('event:auth-loginConfirmed received');
      if (angular.isDefined(modalInstance)) {
        modalInstance.close();
      }
      modalInstance = undefined;
    });
  }
]);
