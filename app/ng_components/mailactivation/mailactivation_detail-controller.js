'use strict';

angular.module('linshareAdminApp')
  .controller('MailActivationDetailCtrl',
  ['_', '$scope', '$state', 'currentMailActivation', 'listMailActivation',
    function(_, $scope, $state, currentMailActivation, listMailActivation) {
      $scope.iconSaved = false;
      $scope.view = (!$state.params.view || ($state.params.view !== 'simple' &&
        $state.params.view !== 'advanced') ) ?
        'simple' : $state.params.view;
      $scope.mailActivation = currentMailActivation;
      var mailActivation = listMailActivation.sort();
	    var indexOfMailActivation = _.indexOf(mailActivation, currentMailActivation.identifier);
	    $scope.nextElem = mailActivation[indexOfMailActivation + 1];
	    $scope.prevElem = mailActivation[indexOfMailActivation - 1];
    }]
);
