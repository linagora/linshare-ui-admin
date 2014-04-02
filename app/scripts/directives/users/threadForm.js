'use strict';

app.directive('lsThreadForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'Restangular', 'ngTableParams', 'Thread', 'ThreadMember', 'User',
        function($scope, $filter, $log, Restangular, ngTableParams, Thread, ThreadMember, User) {
          $scope.thread = Restangular.copy(Thread.getCurrent());
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.remove = function() {
            Thread.remove($scope.thread, function successCallback() {
              $scope.cancel();
            });
          };
          $scope.reset = function() {
            $scope.thread = Restangular.copy(Thread.getCurrent());
          };
          $scope.cancel = function() {
            Thread.setCurrent(undefined);
          };
          $scope.submit = function() {
            Thread.update($scope.thread, function successCallback() {
              $scope.cancel();
            });
          };
          $scope.addMember = function(member) {
            ThreadMember.add($scope.thread, member, function successCallback() {
              $scope.reloadList();
              $scope.userToAdd = undefined;
            });
          };
          $scope.autocompleteUsers = function(pattern) {
            return User.autocomplete(pattern, function successCallback(users) {
              // Remove existing members
              angular.forEach($scope.tableParams.data, function(threadMember) {
                angular.forEach(users, function(user, key) {
                  if (user.domain === threadMember.userDomainId
                        && user.mail === threadMember.userMail) {
                    users.splice(key, 1);
                  }
                });
              });
              return users;
            });
          };
          $scope.updateMember = function(member) {
            ThreadMember.update(member);
          };
          $scope.deleteMember = function(member) {
            ThreadMember.remove(member, function successCallback() {
              $scope.reloadList();
            });
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              firstName: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              ThreadMember.getAll($scope.thread, function(threadMembers) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(threadMembers, params.orderBy()) :
                                    threadMembers;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: '/views/templates/users/thread_form.html',
      replace: false
    };
  }
]);
