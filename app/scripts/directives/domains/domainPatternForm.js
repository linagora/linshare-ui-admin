'use strict';

app.directive('lsDomainPatternForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        domainPatternToEdit: '=domainPattern',
        showCreationForm: '='
      },
      link: function(scope, element, attrs) {
        scope.confirmCollapsed = true;
        scope.hideForm = false;
      },
      controller: ['$scope', '$rootScope', 'Restangular', 'loggerService',
        function($scope, $rootScope, Restangular, Logger) {
          // isCreation ?
          if (_.isUndefined($scope.domainPatternToEdit) || _.isNull($scope.domainPatternToEdit)) {
            $scope.submit = function(domainPattern) {
              Logger.debug('domainPattern creation :' + domainPattern.identifier);
              Restangular.all('domain_patterns').post(domainPattern).then(function success(domainPatterns) {
                $rootScope.$broadcast('reloadList');
                $rootScope.$broadcast('showList');
                $scope.showCreationForm = false;
                $scope.hideForm = true;
              }, function error() {
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
              domainPattern.put().then(function success(domainPatterns) {
                $rootScope.$broadcast('reloadList');
                $scope.hideForm = true;
              }, function error() {
                Logger.error('Unable to update the domainPattern : ' + domainPattern.identifier);
              });
            };
            $scope.reset = function() {
              $scope.domainPattern = Restangular.copy($scope.domainPatternToEdit);
            };
            $scope.delete = function(domainPattern) {
              Logger.debug('domainPattern deletion : ' + domainPattern.identifier);
              domainPattern.remove().then(function success(domainPatterns) {
                $rootScope.$broadcast('reloadList');
                $scope.hideForm = true;
              }, function error() {
                Logger.error('Unable to delete the domainPattern : ' + domainPattern.identifier);
              });
            }
            $scope.creation = false;
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/domains/domain_pattern_form.html',
      replace: false
    };
  }
]);
