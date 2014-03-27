'use strict';

app.directive('lsThreadForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'Restangular', 'ngTableParams', 'Thread', 'ThreadMember',
        function($scope, $filter, $log, Restangular, ngTableParams, Thread, ThreadMember) {
          $scope.thread = Restangular.copy(Thread.getCurrent());
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.remove = function() {
            Thread.remove($scope.thread, function successCallback() {
              Thread.setCurrent(undefined);
            });
          };
          $scope.reset = function() {
            $scope.thread = Restangular.copy(Thread.getCurrent());
          };
          $scope.submit = function() {
            Thread.update($scope.thread, function successCallback() {
              Thread.setCurrent(undefined);
            });
          };
          $scope.addMember = function(member) {
            ThreadMember.add(member, function successCallback() {
              $scope.reloadList();
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