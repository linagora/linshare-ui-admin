'use strict';

describe('Controller: FunctionalitymanagementCtrl', function () {

  // load the controller's module
  beforeEach(module('linshareAdminApp'));

  var FunctionalitymanagementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FunctionalitymanagementCtrl = $controller('FunctionalitymanagementCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
