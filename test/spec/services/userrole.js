'use strict';

describe('Service: UserRole', function () {

  // load the service's module
  beforeEach(module('linshareAdminApp'));

  // instantiate service
  var UserRole;
  beforeEach(inject(function (_UserRole_) {
    UserRole = _UserRole_;
  }));

  it('should do something', function () {
    expect(!!UserRole).toBe(true);
  });

});
