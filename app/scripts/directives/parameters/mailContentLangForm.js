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
                $scope.mailContentLang = newValue;
              }
            },
            true
          );
          MailContent.getAll(Domain.getCurrent(), function(mailContents) {
            $scope.mailContents = mailContents;
          });
          $scope.update = function() {
            MailContentLang.update($scope.mailContentLang, function() {
              $scope.cancel();
            });
          };
          $scope.cancel = function() {
            MailContentLang.setCurrent(undefined);
          };
          $scope.lang = 0;
        }
      ],
      templateUrl: 'views/templates/parameters/mailcontentlang_form.html',
      replace: false
    };
  }
]);
