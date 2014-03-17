'use strict';

describe('Service: LdapConnection', function () {

  // load the service's module
  beforeEach(module('linshareFrontendAdminApp'));

  // instantiate service
  var LdapConnection;
  beforeEach(inject(function (_LdapConnection_) {
    LdapConnection = _LdapConnection_;
  }));

  it('should do something', function () {
    expect(!!LdapConnection).toBe(true);
  });

});
