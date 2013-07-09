'use strict';

app.directive('linshareDomainPatternForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        domainPatternToEdit: '=domainPattern'
      },
      controller: ['$scope', '$route', 'Restangular', 'loggerService',
        function($scope, $route, Restangular, Logger) {
          // isCreation ?
          if (_.isUndefined($scope.domainPatternToEdit) || _.isNull($scope.domainPatternToEdit)) {
            $scope.submit = function(domainPattern) {
              Logger.debug('domainPattern creation :' + domainPattern.identifier);
              Restangular.all('admin').all('domain_patterns').post(domainPattern).then(function successCallback(domainPatterns) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to create the domainPattern : ' + domainPattern.identifier);
              });
            };
            $scope.reset = function() {
              $scope.domainPattern = {};
            };
            $scope.creation = true;
          } else {
            $scope.submit = function(domainPattern) {
              Logger.debug('domainPattern edition :' + domainPattern.identifier);
              domainPattern.put().then(function successCallback(domainPatterns) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to update the domainPattern : ' + domainPattern.identifier);
              });
            };
            $scope.reset = function() {
              $scope.domainPattern = Restangular.copy($scope.domainPatternToEdit);
            };
            $scope.delete = function(domainPattern) {
              Logger.debug('domainPattern deletion : ' + domainPattern.identifier);
              domainPattern.remove().then(function successCallback(domainPatterns) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to delete the domainPattern : ' + domainPattern.identifier);
              });
            }
            $scope.creation = false;
            $scope.confirmCollapsed = true;
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/forms/domain_pattern.html',
      replace: false
    };
  }
]);
