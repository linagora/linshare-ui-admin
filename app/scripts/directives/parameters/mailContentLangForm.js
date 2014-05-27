'use strict';

angular.module('linshareAdminApp').directive('lsMailContentLangForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$log', 'MailContentLang', 'MailConfig',
        function($scope, $log, MailContentLang, MailConfig) {
          $scope.$watch(MailContentLang.getCurrent,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.reset();
              }
            },
            true
          );
          $scope.update = function() {
            MailContentLang.update($scope.mailContentLang, function() {
              $scope.cancel();
            });
          };
          $scope.reset = function() {
            $scope.mailContentLang = MailContentLang.copyCurrent();
            MailConfig.getAllMailContents($scope.mailContentLang.language, $scope.mailContentLang.mailContentType,
              function(mailContents) {
                $scope.mailContents = mailContents;
              }
            );
          };
          $scope.cancel = function() {
            MailContentLang.setCurrent(undefined);
          };
        }
      ],
      templateUrl: 'views/templates/parameters/mailcontentlang_form.html',
      replace: false
    };
  }
]);
