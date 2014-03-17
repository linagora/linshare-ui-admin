'use strict';

describe('Service: DomainPattern', function () {

  // load the service's module
  beforeEach(module('linshareFrontendAdminApp'));

  // instantiate service
  var DomainPattern;
  beforeEach(inject(function (_DomainPattern_) {
    DomainPattern = _DomainPattern_;
  }));

  it('should do something', function () {
    expect(!!DomainPattern).toBe(true);
  });

});
