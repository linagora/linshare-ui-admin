'use strict';

angular.module('myApp.controllers')
  .controller('FunctionalityManagementCtrl',
    ['$scope', '$log', 'Domain', 'Functionality',
      function ($scope, $log, Domain, Functionality) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentFunctionality = function() {
          return Functionality.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          Functionality.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
