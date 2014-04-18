'use strict';

describe('Service: Domain', function () {
  var httpBackend, notificationMock;
  var lsAppConfig;

  // load the service's module
  beforeEach(function() {
    module('linshareAdminApp', function($provide) {
      notificationMock = jasmine.createSpyObj('Notification', ['addSuccess']);
      $provide.value('Notification', notificationMock);
    });
  });

  // instantiate service
  var Domain;
  beforeEach(inject(function ($httpBackend, _lsAppConfig_, _Domain_) {
    httpBackend = $httpBackend;
    lsAppConfig = _lsAppConfig_;
    Domain = _Domain_;
  }));

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should provide domain tree', function () {
    var sampleData = {
      'identifier': 'LinShareRootDomain',
      'children': [
        {
          'identifier': 'TopDomain1'
        }, {
          'identifier': 'TopDomain2',
          'children': [
            {
              'identifier': 'SubDomain1',
              'children': []
            }
          ]
        }
      ]
    };
    var result;

    httpBackend.expectGET(lsAppConfig.backendURL + '/domains/LinShareRootDomain?tree=true').respond(sampleData);
    Domain.getDomainTree(function(domainTree) {
      result = domainTree;
    });
    httpBackend.flush();
    expect(result.children[0].route).toBe(result.route);
    expect(result.children[1].route).toBe(result.route);
    expect(result.children[1].children[0].route).toBe(result.route);
  });

  /**
  it('should provide domain list', function () {
    Domain.getAll();
  });

  it('should create top domain', function () {
    Domain.getAll();
  });

  it('should create sub domain', function () {
    Domain.getAll();
  });

  it('should create guest domain', function () {
    Domain.getAll();
  });
  **/
});
