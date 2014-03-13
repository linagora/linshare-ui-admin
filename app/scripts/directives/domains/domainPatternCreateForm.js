'use strict';

app.directive('lsDomainPatternCreateForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller: ['$scope', '$rootScope', '$log', 'Restangular', 'notificationService',
        function($scope, $rootScope, $log, Restangular, notificationService) {
          Restangular.all('domain_patterns').all('models').getList().then(function(models) {
            var emptyModel = {identifier: ''};
            $scope.models = models;
            $scope.models.push(emptyModel);
            $scope.modelSelector = emptyModel;
          });
          $scope.$watch('modelSelector', function() {
            $scope.reset();
          });
          $scope.domainPattern = {};
          $scope.submit = function(domainPattern) {
            $log.debug('domainPattern creation: ' + domainPattern.identifier);
            Restangular.all('domain_patterns').post(domainPattern).then(function success(domainPatterns) {
              $rootScope.$broadcast('reloadList');
              $rootScope.$broadcast('showList');
              $scope.reset();
              notificationService.addSuccess('P_Domains-DomainPatterns_CreateSuccess');
            });
          };
          function unRestangularizeElement(obj) {
            if (obj) {
              delete obj.route;
              delete obj.parentResource;
              delete obj.restangularCollection;
            }
          }
          $scope.reset = function() {
            unRestangularizeElement($scope.modelSelector);
            angular.copy($scope.modelSelector, $scope.domainPattern);
            $scope.domainPattern.identifier = "";
          };
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_pattern_create_form.html',
      replace: false
    };
  }
]);
