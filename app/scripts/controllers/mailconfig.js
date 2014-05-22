'use strict';

angular.module('linshareAdminApp')
  .controller('MailConfigCtrl',
    ['$scope', '$log', 'Domain', 'MailConfig', 'MailContentLang',
      function ($scope, $log, Domain, MailConfig, MailContentLang) {
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
          Domain.setCurrent(undefined);
          MailConfig.setCurrent(undefined);
          MailContentLang.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
