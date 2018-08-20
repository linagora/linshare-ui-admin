/**
 * GroupPatternDetail Controller
 * @namespace GroupPatternDetail
 * @memberOf linshareAdminApp
 */
(function () {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('GroupPatternDetailController', GroupPatternDetailController);

  GroupPatternDetailController.$inject = [
    'currentGroupPattern',
    'groupPatternService',
    'models',
    '$log',
    '$modal',
    '$scope',
    '$state'
  ];

  /**
   * @namespace GroupPatternDetailController
   * @desc Application group pattern detail controller
   * @memberOf linshareAdminApp
   */
  function GroupPatternDetailController(
    currentGroupPattern,
    groupPatternService,
    models,
    $log,
    $modal,
    $scope,
    $state
  ) {
    /* jshint validthis: true */
    var groupPatternDetailVm = this;

    groupPatternDetailVm.reset = reset;
    groupPatternDetailVm.submit = submit;
    groupPatternDetailVm.remove = remove;
    groupPatternDetailVm.state = $state.params.formState;
    groupPatternDetailVm.groupPattern = currentGroupPattern || {};

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.GroupPatternDetailController
     */
    function activate() {
      if (groupPatternDetailVm.state === 'create') {
        var emptyModel = groupPatternService.getEmptyModel();
        groupPatternDetailVm.models = models;
        groupPatternDetailVm.models.push(emptyModel);
        groupPatternDetailVm.modelSelector = emptyModel;
        $scope.$watch('groupPatternDetailVm.modelSelector', function () {
          groupPatternDetailVm.groupPattern = groupPatternService.copyFromModel(groupPatternDetailVm.modelSelector);
        });
      }
    }

    function submit() {
      if (groupPatternDetailVm.state === 'edit') {
        groupPatternService.update(groupPatternDetailVm.groupPattern);
        $state.go('grouppattern.list');
      } else if (groupPatternDetailVm.state === 'create') {
        groupPatternService.add(groupPatternDetailVm.groupPattern).then(function () {
          $state.go('grouppattern.list');
        });
      } else {
        $log.error('GroupPatternDetailController.submit - Invalid state');
      }
    }

    function remove() {
      if (groupPatternDetailVm.state === 'edit') {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function () {
              return 'GROUP_PATTERNS.CONFIRM_DELETE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            groupPatternService.remove(groupPatternDetailVm.groupPattern).then(function () {
              $state.go('grouppattern.list');
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      } else {
        $log.error('Invalid state');
      }
    }

    function reset() {
      $state.reinit();
    }
  }
})();
