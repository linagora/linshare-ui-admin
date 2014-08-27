'use strict';

angular.module('linshareAdminApp')
  .controller('MailCtrl',
    ['$scope', '$log', 'Mail',
      function ($scope, $log, Mail) {
        $scope.getCurrentMail = function() {
          return Mail.getCurrent();
        };
      }
    ]
  );
