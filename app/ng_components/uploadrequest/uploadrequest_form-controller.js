'use strict';

angular.module('linshareAdminApp')
  .controller('UploadRequestFormCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'UploadRequest', 'uploadRequestStatus',
    function($scope, $filter, $log, ngTableParams, UploadRequest, uploadRequestStatus) {
      $scope.allStatus = uploadRequestStatus;

      $scope.criteria = {
        status: []
      };
      $scope.toggleSelection = function toggleSelection(s) {
        var idx = $scope.criteria.status.indexOf(s);
        if (idx > -1) {
          $scope.criteria.status.splice(idx, 1);
        } else {
          $scope.criteria.status.push(s);
        }
      };
      $scope.reloadList = function() {
        $scope.tableParams.reload();
      };
      $scope.opened = {
        from: false,
        to : false
      };
      $scope.humanFileSize = function(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (bytes < thresh) {
          return bytes + ' B';
        }
        var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
          bytes /= thresh;
          ++u;
        } while (bytes >= thresh);
        return bytes.toFixed(1) + ' ' + units[u];
      };
      $scope.setCurrentUuid = function(uuid) {
        $scope.currentUuid = uuid;
        $scope.tableParamsHistory.reload();
      };
      $scope.open = function(key, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[key] = true;
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          subject: 'desc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          UploadRequest.query($scope.criteria).then(function(uploadRequests) {
            $scope.currentUuid = undefined;
            var orderedData = params.sorting() ?
                                $filter('orderBy')(uploadRequests, params.orderBy()) :
                                uploadRequests;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
      $scope.tableParamsHistory = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          modificationDate: 'desc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          if ($scope.currentUuid) {
            UploadRequest.history($scope.currentUuid).then(function(history) {
              var orderedData = params.sorting() ?
                                  $filter('orderBy')(history, params.orderBy()) :
                                  history;
              params.total(orderedData.length);
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          } else {
            $defer.resolve();
          }
        }
      });
    }]
  );

