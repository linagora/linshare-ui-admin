'use strict';

angular.module('myApp.controllers')
  .controller('DomainPolicyCtrl',
    ['$scope', '$log', 'DomainPolicy',
      function ($scope, $log, DomainPolicy) {
        $scope.getCurrentDomainPolicy = function() {
          return DomainPolicy.getCurrent();
        };
      }
    ]
  );
