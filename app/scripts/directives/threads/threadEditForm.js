'use strict';

app.directive('lsThreadEditForm', function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: { threadToEdit: '=' },
      link: function(scope, element, attrs) { scope.showThreadEditForm = false; },
      controller: ['$scope', '$rootScope', '$location', 'Restangular', 'loggerService', 'notificationService',
        function($scope, $rootScope, $location, Restangular, Logger, notificationService) {
          $scope.thread = {};
          $scope.open = function() {
            $timeout(function() {
              $scope.opened = true;
            });
          };
          $scope.$watch('threadToEdit', function(newValue, oldValue) {
            if (_.isObject(newValue)) {
              angular.copy(newValue, $scope.thread);
            }
          }, true);
          $scope.$watch('thread', function(newValue, oldValue) {
            if (_.isEmpty(newValue)) {
              $scope.showThreadEditForm = false;
            } else {
              $scope.showThreadEditForm = true;
            }
          }, true);
          $scope.cancel = function() {
            $scope.thread = {};
            $rootScope.$broadcast('reloadList');
          };
	  $scope.editMembers = function() {
            $location.path('/threads/' + $scope.threadToEdit.uuid);
	  };
          $scope.submit = function(thread) {
            Logger.debug('thread edition: ' + thread.mail);
            angular.copy($scope.thread, $scope.threadToEdit);
            $scope.threadToEdit.put();
            $scope.cancel();
            notificationService.addSuccess('THREAD NAME EDITED FOOBAR');
          };
        }
      ],
      templateUrl: '/views/templates/threads/thread_edit_form.html',
      replace: false
    };
  }
);
