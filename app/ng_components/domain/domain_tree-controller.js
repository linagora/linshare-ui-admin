'use strict';

angular.module('linshareAdminApp')
  .controller('DomainTreeCtrl',
  ['$scope', '$log', '$state', 'treeType', 'rootDomain',
    function ($scope, $log, $state, treeType, rootDomain) {
      $scope.root = [rootDomain];
      $scope.state = treeType;
      $scope.hasGuestDomain = function (topDomain) {
        return !_.isEmpty(
          _.find(topDomain.children, {'type': 'GUESTDOMAIN'})
        );
      };
      $scope.canAddChildDomain = function (domain) {
        return $scope.state === 'edit' &&
          (domain.type === 'TOPDOMAIN' || domain.type === 'ROOTDOMAIN');
      };
      $scope.canAddTopDomain = function (domain) {
        return domain.type === 'ROOTDOMAIN';
      };
      $scope.canAddSubDomain = function (domain) {
        return domain.type === 'TOPDOMAIN';
      };
      $scope.canAddGuestDomain = function (domain) {
        return (domain.type === 'TOPDOMAIN' &&
          _.isEmpty(
            _.find(domain.children, {'type': 'GUESTDOMAIN'})
          )
        );
      };
    }]
);
