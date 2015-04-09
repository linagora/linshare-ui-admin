'use strict';

angular.module('linshareAdminApp')
  .controller('WelcomeMessageListCtrl',
    ['$rootScope', '$state', '$scope', '$filter', '$translate', '$modal', 'ngTableParams', 'Domain', 'WelcomeMessage', 'welcomesMessages', 'rootDomain', 'authenticatedUser',
    function($rootScope, $state, $scope, $filter, $translate, $modal, ngTableParams, Domain, WelcomeMessage, welcomesMessages, rootDomain, authenticatedUser) {
      $scope.domain = $state.params.domainId;
      $scope.user = authenticatedUser;
      Domain.getAll().then(function(domains) {
        $scope.isMyDomain = (_.findWhere(domains, {'identifier': $scope.domain})) ? true : false;
        if ($scope.isMyDomain || $scope.user.accountType == 'ROOT')
          $scope._domain = Domain.get($scope.domain);
        else
          $scope._domain = null;
      });

      $scope.add = function(welcomeMessage) {
        var modalInstance = $modal.open({
          controller: 'welcomeMessageModalCtrl',
          templateUrl: 'ng_components/welcomemessage/welcomemessage_modal.tpl.html',
          resolve: {
            _welcomeMessage: function() {
              return welcomeMessage;
            },
            _domain: function() {
              return $scope._domain;
            },
            _adminDomain: function() {
              return authenticatedUser.domain;
            }
          }
        });
      };
      $scope.new = function() {
        var modalInstance = $modal.open({
          controller: 'welcomeMessageModalCtrl',
          templateUrl: 'ng_components/welcomemessage/welcomemessage_modal.tpl.html',
          resolve: {
            _welcomeMessage: function() {
              // The default uuid of the default welcome message
              return WelcomeMessage.get('4bc57114-c8c9-11e4-a859-37b5db95d856');
            },
            _domain: function() {
              return $scope._domain;
            },
            _adminDomain: function() {
              return null;
            }
          }
        });
      };
      $scope.delete = function (_welcomeMessage) {
        WelcomeMessage.remove(_welcomeMessage).then(function() {
          $state.reinit();
        });
      };
      var getTemplate = function () {
        return '/i18n/templates/' + $translate.use() + '/WELCOME_MESSAGE.tpl.html';
      };
      $rootScope.$on('$translateChangeSuccess', function() {
        $scope.welcomeMessageTpl  = getTemplate();
      });
      $scope.welcomeMessageTpl  = getTemplate();
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          name: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
                    $filter('filter')(welcomesMessages, params.filter()) :
                    welcomesMessages;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          $scope.isCollapsed = (orderedData.length == 0) ? true : false;
        }
      });
    }]
  );

