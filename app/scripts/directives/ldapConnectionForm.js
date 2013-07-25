'use strict';

app.directive('linshareLdapConnectionForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        ldapConnectionToEdit: '=ldapConnection',
        showCreationForm: '='
      },
      link: function(scope, element, attrs) {
        scope.confirmCollapsed = true;
        scope.hideForm = false;
      },
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService',
        function($scope, $rootScope, Restangular, Logger) {
          // isCreation ?
          if (_.isUndefined($scope.ldapConnectionToEdit) || _.isNull($scope.ldapConnectionToEdit)) {
            $scope.submit = function(ldapConnection) {
              Logger.debug('ldapConnection creation :' + ldapConnection.identifier);
              Restangular.all('ldap_connections').post(ldapConnection).then(function success(ldapConnections) {
                $rootScope.$broadcast('reloadList');
                $rootScope.$broadcast('showList');
                $scope.showCreationForm = false;
                $scope.hideForm = true;
              }, function error() {
                Logger.error('Unable to create the ldapConnection : ' + ldapConnection.identifier);
              });
            };
            $scope.reset = function() {
              $scope.ldapConnection = {};
            };
            $scope.creation = true;
          } else {
            $scope.submit = function(ldapConnection) {
              Logger.debug('ldapConnection edition :' + ldapConnection.identifier);
              ldapConnection.put().then(function success(ldapConnections) {
                $rootScope.$broadcast('reloadList');
                $scope.hideForm = true;
              }, function error() {
                Logger.error('Unable to update the ldapConnection : ' + ldapConnection.identifier);
              });
            };
            $scope.reset = function() {
              $scope.ldapConnection = Restangular.copy($scope.ldapConnectionToEdit);
            };
            $scope.delete = function(ldapConnection) {
              Logger.debug('ldapConnection deletion : ' + ldapConnection.identifier);
              ldapConnection.remove().then(function success(ldapConnections) {
                $rootScope.$broadcast('reloadList');
                $scope.hideForm = true;
              }, function error() {
                Logger.error('Unable to delete the ldapConnection : ' + ldapConnection.identifier);
              });
            }
            $scope.creation = false;
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/forms/ldap_connection.html',
      replace: false
    };
  }
]);
