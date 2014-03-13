'use strict';

app.controller('LoginFormCtrl', ['$scope', '$log', '$modal',
  function($scope, $log, $modal) {
    var modalInstance = undefined;
    $scope.$on('event:auth-loginRequired', function() {
      $log.debug('event:auth-loginRequired received');
      if (_.isUndefined(modalInstance)) {
        modalInstance = $modal.open({
          backdrop: 'static',
          controller: ModalInstanceCtrl,
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


var ModalInstanceCtrl = function ($scope, $log, $modalInstance, Restangular, authService) {
  // Need this variable to store modal inputs
  // because of Javascript's prototypical inheritance
  $scope.input = {};

  $scope.submit = function() {
    $log.debug('submit login form');
    var success = function(data) {
      $log.debug('Authentication succeed');
      authService.loginConfirmed(data);
      $log.debug('Connected as ' + data.mail);
      $log.debug('Authentication data' + data);
    };
    var error = function(data) {
      $scope.errorLogin = 'Bad credentials';
      $log.debug('Authentication failed');
      $log.debug('Authentication data' + data);
    };

    Restangular.all('authentication').customGET('authorized', {
      // QueryParams - Bypass the module authService
      ignoreAuthModule: true
    }, {
      // Headers - Add login password
      Authorization: 'Basic ' + Base64.encode($scope.input.login + ':' + $scope.input.password)
    }).then(success, error);
  };

  this.close = function() {
    $modalInstance.close();
  };
};
