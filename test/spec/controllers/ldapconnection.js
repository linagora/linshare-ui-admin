'use strict';

describe('Controller: LdapconnectionCtrl', function () {

  // load the controller's module
  beforeEach(module('linshareAdminApp'));

  var LdapconnectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LdapconnectionCtrl = $controller('LdapconnectionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
