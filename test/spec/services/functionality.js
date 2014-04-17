'use strict';

describe('Service: Functionality', function () {

  // load the service's module
  beforeEach(module('linshareUiAdmin'));

  // instantiate service
  var Functionality;
  beforeEach(inject(function (_Functionality_) {
    Functionality = _Functionality_;
  }));

  it('should do something', function () {
    expect(!!Functionality).toBe(true);
  });

});
