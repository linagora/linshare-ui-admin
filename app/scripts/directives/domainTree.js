'use strict';

app.directive('linshareDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      controller: ['$scope', 'manageDomainService','loggerService',
        function($scope, manageDomainService, Logger) {
          $scope.hasGuestDomain = function(topDomain) {
            return !_.isEmpty(
              _.find(topDomain.children, {
                'type': 'GUESTDOMAIN'
              })
            );
          };
          function hideEditForm() {
            $scope.currentDomain = null;
            $scope.$broadcast('currentDomainChanged');
          }
          $scope.configDomain = function(domain) {
            $scope.currentDomain = domain;
            $scope.$broadcast('currentDomainChanged');
          };
          $scope.addTopDomain = function(rootDomain) {
            hideEditForm();
            manageDomainService.addChildDomain(rootDomain, 'TOPDOMAIN');
          };
          $scope.addSubDomain = function(topDomain) {
            hideEditForm();
            manageDomainService.addChildDomain(topDomain, 'SUBDOMAIN');
          };
          $scope.addGuestDomain = function(topDomain) {
            hideEditForm();
            manageDomainService.addChildDomain(topDomain, 'GUESTDOMAIN');
          };
          $scope.$on('domainTreeNeedRefresh', function() {
            manageDomainService.getAllDomains(function success(domains) {
              $scope.rootDomain = domains;
              hideEditForm();
            }, function error() {
              Logger.error('Unable to get domains list');
            });
          });
        }
      ],
      templateUrl: '/views/templates/domain_tree.html',
      replace: false
    };
  }
]);
