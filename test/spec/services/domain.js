'use strict';

describe('Service: Domain', function () {

  // load the service's module
  beforeEach(module('linshareAdminApp'));

  // instantiate service
  var Domain;
  beforeEach(inject(function (_Domain_) {
    Domain = _Domain_;
  }));

  it('should do something', function () {
    expect(!!Domain).toBe(true);
  });

});
