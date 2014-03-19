'use strict';

describe('Controller: DomainmanagementCtrl', function () {

  // load the controller's module
  beforeEach(module('linshareFrontendAdminApp'));

  var DomainmanagementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DomainmanagementCtrl = $controller('DomainmanagementCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
