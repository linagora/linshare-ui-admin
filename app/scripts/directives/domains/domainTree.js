'use strict';

app.directive('lsDomainTree', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        needReload: '=reload'
      },
      controller: ['$scope', '$modal', '$log', 'Domain', 'localize',
        function($scope, $modal, $log, Domain, localize) {
          function reload() {
            Domain.getDomainTree(function (domainTree){
              $scope.rootDomain = domainTree;
            });
          };
          reload();
          $scope.$watch('needReload',
            function(newValue, oldValue) {
              if (newValue && newValue !== oldValue) {
                reload();
                $scope.needReload = false;
              }
            }
          );
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
            Domain.setCurrentTopDomainSample(rootDomain);
          };
          $scope.addSubDomain = function(topDomain) {
            Domain.setCurrentSubDomainSample(topDomain);
          };
          $scope.addGuestDomain = function(topDomain) {
            Domain.setCurrentGuestDomainSample(topDomain);
          };
        }
      ],
      templateUrl: '/views/templates/domains/domain_tree.html',
      replace: false
    };
  }
]);
