'use strict';

angular.module('linshareAdminApp')
  .controller('MailActivationDetailCtrl',
  ['$scope', '$state', 'currentMailActivation',
    function($scope, $state, currentMailActivation) {
      $scope.iconSaved = false;
      $scope.view = (!$state.params.view || ($state.params.view != 'simple' && $state.params.view != 'advanced') ) ?
        'simple' : $state.params.view;
      $scope.mailActivation = currentMailActivation;
    }]
);
