'use strict';

app.directive('lsThreadForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'Thread', 'ThreadMember',
        function($scope, $filter, $log, ngTableParams, Thread, ThreadMember) {
          var getData = function() {
            return $scope.dataset;
          };

          $scope.thread = Thread.getCurrent();
          $scope.dataset = [];
          $scope.reloadList = function () {
            ThreadMember.getAll($scope.thread, function(threadMembers) {
              $scope.dataset = threadMembers;
            });
          };
          $scope.reloadList();
          $scope.remove = function() {
            Thread.remove($scope.thread, function successCallback() {
              Thread.setCurrent(undefined);
            });
          };
          $scope.reset = function() {
            $scope.thread = Thread.getCurrent();
          };
          $scope.submit = function() {
            Thread.update($scope.thread, function successCallback() {
              Thread.setCurrent(undefined);
            });
          };
          $scope.addMember = function(member) {
            ThreadMember.add(member, function successCallback() {
              $scope.tableParams.reload();
            });
          };
          $scope.updateMember = function(member) {
            ThreadMember.update(member);
          };
          $scope.deleteMember = function(member) {
            ThreadMember.remove(member, function successCallback() {
              $scope.tableParams.reload();
            });
          };
          $scope.$watch("dataset", function () {
            $scope.tableParams.reload();
          });
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              name: 'asc',
            }
          }, {
            debugMode: false,
            total: function () { return getData().length; }, // length of data
            getData: function($defer, params) {
              var filteredData = getData();
              var orderedData = params.sorting() ?
                                  $filter('orderBy')(filteredData, params.orderBy()) :
                                  filteredData;
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {} }
          });
        }
      ],
      templateUrl: '/views/templates/users/thread_form.html',
      replace: false
    };
  }
]);
