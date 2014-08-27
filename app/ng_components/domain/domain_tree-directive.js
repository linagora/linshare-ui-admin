'use strict';

angular.module('linshareAdminApp').directive('lsDomainTree', [
  function() {
    return {
      restrict: 'A',
      scope: {
        state: '@',
        root: "="
      },
      controller: ['$scope', '$log', 'Domain',
        function($scope, $log, Domain) {
          $scope.setCurrentDomain = function(domain) {
            Domain.setCurrent(domain);
          }
          $scope.hasGuestDomain = function(topDomain) {
            return !_.isEmpty(
              _.find(topDomain.children, {
                'type': 'GUESTDOMAIN'
              })
            );
          };
          $scope.canAddChildDomain = function(domain) {
            return $scope.state === 'edit' && 
              (domain.type === 'TOPDOMAIN' || domain.type === 'ROOTDOMAIN');
          };
          $scope.canAddTopDomain = function(domain) {
            return domain.type === 'ROOTDOMAIN';
          };
          $scope.addTopDomain = function(domain) {
            Domain.setCurrentTopDomainSample(domain);
          };
          $scope.canAddSubDomain = function(domain) {
            return domain.type === 'TOPDOMAIN';
          };
          $scope.addSubDomain = function(domain) {
            Domain.setCurrentSubDomainSample(domain);
          };
          $scope.canAddGuestDomain = function(domain) {
            return (domain.type === 'TOPDOMAIN' &&
              _.isEmpty(
                _.find(domain.children, {
                  'type': 'GUESTDOMAIN'
                })
              )
            );
          };
          $scope.addGuestDomain = function(domain) {
            Domain.setCurrentGuestDomainSample(domain);
          };
        }
      ],
      templateUrl: 'ng_components/domain/domain_tree.tpl.html',
      replace: false
    };
  }
]);
