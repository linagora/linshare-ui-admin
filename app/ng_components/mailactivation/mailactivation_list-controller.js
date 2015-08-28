'use strict';

angular.module('linshareAdminApp')
  .controller('MailActivationListCtrl',
  ['$scope', '$filter', '$q', '$translate', '$state', 'ngTableParams', 'mailActivations', 'currentDomain',
    function ($scope, $filter, $q, $translate, $state, ngTableParams, mailActivations, currentDomain) {
      $scope.domain = currentDomain;
      $scope.view = $state.params.view;

      $scope.isActivated = function (mailActivation) {
        return mailActivation.enable;
      };

      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 30,      // count per page
        sorting: {
          identifier: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var nameFilter = params.filter().descriptionFilter;
          var deferred = $q.defer();

          var orderedData = params.sorting() ?
            $filter('orderBy')(mailActivations, params.orderBy()) :
            mailActivations;
          orderedData = params.filter ?
            $filter('filter')(orderedData, params.filter().identifier) : orderedData;
          if (!_.isEmpty(nameFilter)) {
            var ids = _.pluck(orderedData, 'identifier');
            var mapIdentifierAndTranslationKey = _.map(ids, function(id) {
              return 'MAIL_ACTIVATION.DETAILS.' + id + '.NAME'
            });
            $translate(mapIdentifierAndTranslationKey).then(
              function(translations) {
                deferred.resolve(_.filter(orderedData, function(f) {
                  return translations['MAIL_ACTIVATION.DETAILS.' + f.identifier + '.NAME']
                      .toLowerCase()
                      .indexOf(nameFilter.toLowerCase()) != -1;
                }));
              }
            );
            deferred.promise.then(function(data) {
              var legendFilteredData = params.sorting() ?
                $filter('orderBy')(data, params.orderBy()) :
                data;
              params.total(legendFilteredData.length);
              $defer.resolve(legendFilteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            });
          } else {
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        }
      });
    }]
);

