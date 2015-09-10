'use strict';

angular.module('linshareAdminApp')
  .controller('MailActivationDetailCtrl',
  ['$scope', '$state', 'currentMailActivation', 'listMailActivation',
    function($scope, $state, currentMailActivation, listMailActivation) {
      $scope.iconSaved = false;
      $scope.view = (!$state.params.view || ($state.params.view != 'simple' && $state.params.view != 'advanced') ) ?
        'simple' : $state.params.view;
      $scope.mailActivation = currentMailActivation;
      var listMailActivation = listMailActivation.sort();
	    var indexOfMailActivation = _.indexOf(listMailActivation, currentMailActivation.identifier);
	    $scope.nextElem = listMailActivation[indexOfMailActivation + 1];
	    $scope.prevElem = listMailActivation[indexOfMailActivation - 1];
    }]
);
