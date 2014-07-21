'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'MailConfig', 'MailContentLang',
      function ($scope, $log, Authentication, Domain, MailConfig, MailContentLang) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailConfig = function() {
          return MailConfig.getCurrent();
        };
        $scope.getCurrentMailContentLang = function() {
          return MailContentLang.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            MailConfig.setCurrent(undefined);
            MailContentLang.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
