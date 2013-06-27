'use strict';

app.controller('ShareCtrl', ['$scope', 'Restangular', 'loggerService',
  function($scope, Restangular, Logger) {
    $scope.loadingAnimation = false;
    $scope.shareDocument = function() {
      $scope.alerts = [];
      $scope.loadingAnimation = true;
      var shares = new Array();
      if ($scope.mySelections.length === 0) {
        $scope.loadingAnimation = false;
        $scope.alerts.push({type: 'error', msg: "Pas de fichiers selectionnés"});
        return;
      }
      angular.forEach($scope.mySelections, function(value, key) {
        shares.push({
          recipientLsUuid: $scope.recipient,
          documentDto: {
            uuid: value.uuid
          }
        });
      });
      Restangular.one('shares').customPOST("multiplesharedocuments", {secured: $scope.secured, message: $scope.message}, {}, shares).then(function() {
        $scope.alerts.push({type: 'success', msg: "Fichiers partagés!"});
        $scope.recipient = "";
        $scope.secured = false;
        $scope.message = "";
        $scope.loadingAnimation = false;
      }, function() {
        $scope.alerts.push({type: 'error', msg: "Erreur durant le partage"});
        $scope.loadingAnimation = false;
      });
    }
  }
]);
