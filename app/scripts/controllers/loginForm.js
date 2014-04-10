'use strict';

app.controller('LoginFormCtrl', ['$scope', '$log', '$modal',
  function($scope, $log, $modal) {
    var modalInstance = undefined;
    $scope.$on('event:auth-loginRequired', function() {
      $log.debug('event:auth-loginRequired received');
      if (angular.isUndefined(modalInstance)) {
        modalInstance = $modal.open({
          backdrop: 'static',
          controller: LoginModalInstanceCtrl,
          templateUrl: '/views/templates/login_form.html',
        });
      }
    });
    $scope.$on('event:auth-loginConfirmed', function() {
      $log.debug('event:auth-loginConfirmed received');
      modalInstance.close();
      modalInstance = undefined;
    });
  }
]);


var LoginModalInstanceCtrl = 
[ '$scope',
  '$modalInstance',
  'Authentication',
  function ($scope, $modalInstance, Authentication) {
    // Need this variable to store modal inputs
    // because of Javascript's prototypical inheritance
    $scope.input = {};

    $scope.submit = function() {
      var errorCallback = function() {
        console.log('Bad credentials');
        $scope.errorLogin = 'Bad credentials';
      };
      Authentication.request($scope.input.login, $scope.input.password, errorCallback);
    };

    this.close = function() {
      $modalInstance.close();
    };
  }
];
