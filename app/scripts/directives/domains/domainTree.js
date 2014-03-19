'use strict';

app.directive('lsDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: {},
      controller: ['$scope', '$modal', '$log', 'Domain', 'localize',
        function($scope, $modal, $log, Domain, localize) {
          Domain.getDomainTree(function (domainTree){
            $scope.rootDomain = domainTree;
          });
          $scope.editDomain = function(domain) {
            Domain.setCurrent(domain);
          }
          $scope.hasGuestDomain = function(topDomain) {
            return !_.isEmpty(
              _.find(topDomain.children, {
                'type': 'GUESTDOMAIN'
              })
            );
          };
          $scope.addTopDomain = function(rootDomain) {
            Domain.setCurrent(
              Domain.createTopDomainSample(rootDomain)
            );
          };
          $scope.addSubDomain = function(topDomain) {
            Domain.setCurrent(
              Domain.createSubDomainSample(topDomain)
            );
          };
          $scope.addGuestDomain = function(topDomain) {
            Domain.setCurrent(
              Domain.createGuestDomainSample(topDomain)
            );
          };
        }
      ],
      templateUrl: '/views/templates/domains/domain_tree.html',
      replace: false
    };
  }
]);
