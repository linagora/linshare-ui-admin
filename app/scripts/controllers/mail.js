'use strict';

angular.module('myApp.controllers')
  .controller('MailCtrl',
    ['$scope', '$log', 'Mail',
      function ($scope, $log, Mail) {
        $scope.getCurrentMail = function() {
          return Mail.getCurrent();
        };
      }
    ]
  );
