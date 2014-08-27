'use strict';

angular.module('linshareAdminApp').directive('lsFunctionalityList', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.showFunctionality = function(functionality) {
          return functionality.activationPolicy.parentAllowUpdate 
                || functionality.configurationPolicy.parentAllowUpdate;
        };
        scope.isActivated = function(functionality) {
          return functionality.activationPolicy.status;
        };
      },
      controller: ['$scope', '$filter', '$q', '$log', '$translate', 'ngTableParams', 'Domain', 'Functionality',
        function($scope, $filter, $q, $log, $translate, ngTableParams, Domain, Functionality) {
          $scope.$watch(Domain.getCurrent,
            function(newValue, oldValue) {
              if (angular.isDefined(newValue)) {
                $scope.tableParams.reload();
              }
            },
            true
          );
          $scope.edit = function(functionality) {
            Functionality.setCurrent(functionality);
          };
          $scope.cancel = function() {
            Domain.setCurrent(undefined);
          };
          $scope.localizedName = function(column) {
            var def = $q.defer();
            var names = [];

            def.resolve(names);
            return def;
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              localizedName: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              Functionality.getAll(Domain.getCurrentId(), function(functionalities) { 
                var displayableFuncs = _.where(functionalities, {'displayable': true});
                var nameFilter = params.filter().localizedName;
                var deferred = $q.defer();

                if (!_.isEmpty(nameFilter)) {
                  var ids = _.pluck(displayableFuncs, 'identifier');
                  var localizedNames = _.map(ids, function(id) { return 'FUNCTIONALITIES.NAME.' + id });
                  $translate(localizedNames).then(
                    function(translations) {
                      deferred.resolve(_.filter(displayableFuncs, function(f) {
                        return translations['FUNCTIONALITIES.NAME.' + f.identifier].toLowerCase().indexOf(nameFilter.toLowerCase()) != -1;
                      }));
                    }
                  );
                  deferred.promise.then(function(data) {
                    var orderedData = params.sorting() ?
                              $filter('orderBy')(data, params.orderBy()) :
                              data;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  });
                } else {
                  var orderedData = params.sorting() ?
                            $filter('orderBy')(displayableFuncs, params.orderBy()) :
                            directive;
                  params.total(orderedData.length);
                  $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
              });
            }
          });
        }
      ],
      templateUrl: 'ng_components/functionality/functionality_list.tpl.html',
      replace: false
    };
  }
]);
