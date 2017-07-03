'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentLangDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailContentLang', 'currentMailContentLang', 'mailContents',
    function($scope, $log, $modal, $state, MailContentLang, currentMailContentLang, mailContents) {
      $scope.mailContentLang = currentMailContentLang;
      $scope.mailContents = mailContents;

      $scope.update = function() {
        MailContentLang.update($scope.mailContentLang).then(function() {
          $scope.cancel();
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.cancel = function() {
        $state.go('mailconfig.detail', {
          id: $state.params.mailConfigId,
          language: $scope.mailContentLang.language,
          domainId: $state.params.domainId
        });
      };
    }]
  );
