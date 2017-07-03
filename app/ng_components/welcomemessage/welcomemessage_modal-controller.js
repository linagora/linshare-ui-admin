'use strict';

angular.module('linshareAdminApp')
  .controller('welcomeMessageModalCtrl',
    ['_', '$scope', '$state', '$modalInstance', '$filter', 'Domain', 'WelcomeMessage', '_welcomeMessage',
      '_adminDomain',  '_domain',
      function(_, $scope, $state, $modalInstance, $filter, Domain, WelcomeMessage, _welcomeMessage,
        _adminDomain, _domain) {
        $scope.welcomeMessage = {};
        $scope.redirect = true;
        $scope.domain = _domain;
        $scope._adminDomain = _adminDomain;
        if (_adminDomain)
        {
          Domain.getAll().then(function(domains) {
            $scope.domains = domains;
            var findDomain = _.findWhere($scope.domains, {'identifier': _welcomeMessage.myDomain.identifier});
            $scope.domain = (findDomain) ? findDomain :  _.findWhere($scope.domains, {'identifier': _adminDomain});
          });
        }
        $scope.isDefined = function(x) {
          return angular.isDefined(x);
        };
        $scope.create = function() {
          $scope.welcomeMessage.uuid = _welcomeMessage.uuid;
          $scope.welcomeMessage.myDomain = {};
          $scope.welcomeMessage.myDomain.identifier = $scope.domain.identifier;
          $scope.welcomeMessage.myDomain.label = $scope.domain.label;
          WelcomeMessage.add($scope.welcomeMessage).then(function(welcomeMessage) {
            $modalInstance.close();
            $scope.reset();
            $state.reinit();
            if ($scope.redirect) {
              $state.go('welcomemessage.detail', {id: welcomeMessage.uuid, state: 'edit'});
            }
          });
        };
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.welcomeMessage = {};
        };
        $scope.reset();
      }
    ]
  );
