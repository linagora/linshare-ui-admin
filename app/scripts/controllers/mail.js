'use strict';

angular.module('linshareUiAdmin')
  .controller('MailCtrl',
    ['$scope', '$log', 'Mail',
      function ($scope, $log, Mail) {
        $scope.getCurrentMail = function() {
          return Mail.getCurrent();
        };
      }
    ]
  );
