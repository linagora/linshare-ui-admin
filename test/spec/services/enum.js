'use strict';

describe('Service: Enum', function () {

  // load the service's module
  beforeEach(module('linshareUiAdminApp'));

  // instantiate service
  var Enum;
  beforeEach(inject(function (_Enum_) {
    Enum = _Enum_;
  }));

  it('should do something', function () {
    expect(!!Enum).toBe(true);
  });

});
