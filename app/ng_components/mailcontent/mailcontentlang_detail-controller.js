'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentLangDetailCtrl',
    ['$scope', '$log', '$modal',  '$state', 'MailContentLang', 'currentMailContentLang', 'mailContents',
    function($scope, $log, $modal, $state, MailContentLang, currentMailContentLang, mailContents) {
      $scope.mailContentLang = currentMailContentLang;
      $scope.mailContents = mailContents;

      $scope.update = function() {
        MailContentLang.update($scope.mailContentLang, function() {
          $scope.cancel();
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.cancel = function() {
        $state.go(".", {mailContentLangId: null});
      };
    }]
  );
