'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityDetailCtrl',
    ['$scope', '$timeout', '$log', '$state', '$filter', '$window', '$translate', '$location', '$rootScope',
      'Functionality', 'currentDomain', 'currentFunctionality', 'childrenFunctionality',
    function($scope, $timeout, $log, $state, $filter, $window, $translate, $location, $rootScope,
             Functionality, currentDomain, currentFunctionality, childrenFunctionality) {
        $scope.iconSaved = false;
        $scope.view = (!$state.params.view || ($state.params.view != 'simple' && $state.params.view != 'advanced') ) ? 'simple' : $state.params.view;
        $scope.functionality = currentFunctionality;
        $scope.childrenFunctionality = childrenFunctionality;
        $scope.domain = currentDomain;

        var bodyHeight = ($window.innerHeight - 250);
        $scope.height = ( bodyHeight > 400 ) ? bodyHeight : 400 ;

        $scope.cancel = function() {
          $state.go('functionality.list', {domainId: $scope.functionality.domain, view: $state.params.view});
        };
        $scope.changeView = function(view) {
          if ($scope.view != view) {
            $state.go('functionality.detail', {domainId: $scope.functionality.domain, id: $scope.functionality.identifier, view: view});
            $scope.view = view;
          }
        };
    }]
  );
