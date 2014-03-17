'use strict';

describe('Service: DomainPolicy', function () {

  // load the service's module
  beforeEach(module('linshareFrontendAdminApp'));

  // instantiate service
  var DomainPolicy;
  beforeEach(inject(function (_DomainPolicy_) {
    DomainPolicy = _DomainPolicy_;
  }));

  it('should do something', function () {
    expect(!!DomainPolicy).toBe(true);
  });

});
