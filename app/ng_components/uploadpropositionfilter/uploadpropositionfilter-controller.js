'use strict';

angular.module('linshareAdminApp')
  .controller('UploadPropositionFilterCtrl',
    ['$scope', '$log', 'UploadPropositionFilter',
      function ($scope, $log, UploadPropositionFilter) {
        $scope.getCurrentFilter = function() {
          return UploadPropositionFilter.getCurrent();
        };
      }
    ]
  );
