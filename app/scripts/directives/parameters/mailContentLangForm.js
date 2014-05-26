'use strict';

angular.module('linshareAdminApp').directive('lsMailContentLangForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$log', 'MailContentLang', 'MailContent', 'Domain',
        function($scope, $log, MailContentLang, MailContent, Domain) {
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
            MailContent.getAll(Domain.getCurrentId(),
                               mailContentLang.language,
                               mailContentLang.mailContentType,
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
