'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityDetailCtrl',
    ['$scope', '$state', '$filter', 'currentFunctionality', 'childrenFunctionality', 'listFunctionalities',
    function($scope, $state, $filter, currentFunctionality, childrenFunctionality, listFunctionalities) {
        $scope.iconSaved = false;
        $scope.view = (!$state.params.view || ($state.params.view != 'simple' && $state.params.view != 'advanced') ) ? 'simple' : $state.params.view;
        $scope.functionality = currentFunctionality;
        $scope.childrenFunctionality = childrenFunctionality;
        var listFunctionalities = $filter('orderBy')(listFunctionalities, ["+localizedName"]);
        var indexOfFunctionality = _.indexOf(listFunctionalities, currentFunctionality.identifier);
        $scope.nextFunctionalities = listFunctionalities[indexOfFunctionality + 1];
        $scope.prevFunctionalities = listFunctionalities[indexOfFunctionality - 1];
    }]
  );
