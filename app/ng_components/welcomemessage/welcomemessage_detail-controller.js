'use strict';

angular.module('linshareAdminApp')
  .controller('WelcomeMessageDetailCtrl',
    ['$log', '$scope', '$state', '$filter', '$modal', '$window', 'ngTableParams', 'currentWelcomesMessage', 'rootDomain', 'WelcomeMessage', 'authenticatedUser',
    function($log, $scope, $state, $filter, $modal, $window, ngTableParams, currentWelcomesMessage, rootDomain, WelcomeMessage, authenticatedUser) {
      var bodyHeight = ($window.innerHeight - 250);
      $scope.height = ( bodyHeight > 400 ) ? bodyHeight : 400;
      $scope.isOpen = true;

      $scope.edit = ($state.params.state == 'show') ? true : false;
      $scope.welcomeMessage = currentWelcomesMessage || {};
      var checkLabel = {true: 'LABEL_UNSELECT', false: 'LABEL_SELECT'};
      $scope.check = {bool: false, label: checkLabel[false]};
      $scope.activeItem = function (domain){
        domain.active = false;
        angular.forEach($scope.allDomains, function(element, index){
          if (domain.identifier == element){
            domain.active = true;
          }
        });
        return domain.active;
      };
      // recursive loop on domain's chlidren to create an object of its children
      // Creating an object with attributs : identifier, label and active.
      // The attribute active allows you to know if the domain belongs the WM
      // this object will be updated and send to the method update WM
      $scope.domainsTree = function (domains) {
        angular.forEach(domains, function(value, key) {
          this.push({identifier: value.identifier, label: value.label, active: $scope.activeItem(value)});
          $scope.domainsTree(value.children);
        }, $scope.domains);
      };
      // Init the domain list,
      // this method will be called after the update to recreate the object with the domains list of the WM
      $scope.initDomains = function () {
        $scope.allDomains = _.pluck($scope.welcomeMessage.domains, 'identifier');
        $scope.domains = [];
        $scope.domains.push({identifier: rootDomain.identifier, label: rootDomain.label, active: $scope.activeItem(rootDomain)});
        $scope.domainsTree(rootDomain.children);
      };
      $scope.initDomains();
      $scope.isParent = function () {
        return (!_.isEmpty(_.find(rootDomain.children, {'identifier': $scope.welcomeMessage.myDomain.identifier})) || (rootDomain.identifier === $scope.welcomeMessage.myDomain.identifier) || rootDomain.type == 'ROOTDOMAIN');
      };
      $scope.changeItem =function(domain) {
        var copy = angular.copy(domain);
        if (!copy.active) {
          delete copy.active;
          $scope.welcomeMessage.domains.push(copy);
        }else {
          $scope.welcomeMessage.domains = _.without($scope.welcomeMessage.domains, _.findWhere($scope.welcomeMessage.domains, {'identifier': copy.identifier}))
        }
        domain.active = !domain.active;
        return domain;
      };
       $scope.reset =function() {
        $state.reinit();
       };
       $scope.selectAll =function() {
        $scope.check.bool = !$scope.check.bool;
        $scope.check.label = checkLabel[$scope.check.bool];
        $scope.welcomeMessage.domains = [];
        if ($scope.check.bool)
        {
          return angular.forEach($scope.domains, function(value, key) {
            this.push({identifier: value.identifier, label: value.label});
            value.active = $scope.check.bool;
          }, $scope.welcomeMessage.domains);
        }
        return angular.forEach($scope.domains, function(value, key) {
          value.active = $scope.check.bool;
        });
      };
      $scope.add = function() {
        var modalInstance = $modal.open({
          controller: 'welcomeMessageModalCtrl',
          templateUrl: 'ng_components/welcomemessage/welcomemessage_modal.tpl.html',
          resolve: {
            _welcomeMessage: function() {
              return $scope.welcomeMessage;
            },
            _adminDomain: function() {
              return authenticatedUser.domain;
            },
            _domain: function() {
              return  null;
            }
          }
        });
      };
      $scope.remove = function() {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'WELCOME_MESSAGES.CONFIRM_DELETE_FORM';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            var domain = $scope.welcomeMessage.myDomain.identifier;
            WelcomeMessage.remove($scope.welcomeMessage).then(function() {
              $state.go('welcomemessage.list', {domainId: domain});
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.submit = function() {
        WelcomeMessage.update($scope.welcomeMessage).then(function (welcomeMessage){
          $scope.welcomeMessage = welcomeMessage;
          $scope.initDomains();
          $scope.tableParams.reload();
        });
      };
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
                    $filter('filter')($scope.domains, params.filter()) :
                    $scope.domains;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }]
  );

