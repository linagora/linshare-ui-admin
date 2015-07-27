'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityDetailCtrl',
    ['$scope', '$state', 'currentDomain', 'currentFunctionality', 'childrenFunctionality',
    function($scope, $state, currentDomain, currentFunctionality, childrenFunctionality) {
        $scope.iconSaved = false;
        $scope.view = (!$state.params.view || ($state.params.view != 'simple' && $state.params.view != 'advanced') ) ? 'simple' : $state.params.view;
        $scope.functionality = currentFunctionality;
        $scope.childrenFunctionality = childrenFunctionality;
        $scope.domain = currentDomain;
    }]
  );
