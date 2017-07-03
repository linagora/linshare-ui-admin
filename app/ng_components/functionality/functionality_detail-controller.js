'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityDetailCtrl',
    ['_', '$scope', '$state', '$filter', 'currentFunctionality', 'childrenFunctionality', 'listFunctionalities',
    function(_, $scope, $state, $filter, currentFunctionality, childrenFunctionality, listFunctionalities) {
        $scope.iconSaved = false;
        $scope.view = (!$state.params.view || ($state.params.view !== 'simple' &&
          $state.params.view !== 'advanced')) ? 'simple' : $state.params.view;
        $scope.functionality = currentFunctionality;
        $scope.childrenFunctionality = childrenFunctionality;
        var functionalities = $filter('orderBy')(listFunctionalities, ['+localizedName']);
        var indexOfFunctionality = _.indexOf(functionalities, currentFunctionality.identifier);
        $scope.nextFunctionalities = functionalities[indexOfFunctionality + 1];
        $scope.prevFunctionalities = functionalities[indexOfFunctionality - 1];
    }]
  );
