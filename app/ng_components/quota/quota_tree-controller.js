/**
 * DomainQuotaTreeController Controller
 * @namespace linshareAdminApp
 */
(function() {
  'use strict';

  angular
    .module('linshareAdminApp')
    .controller('DomainQuotaTreeController', DomainQuotaTreeController);

  DomainQuotaTreeController.$inject = ['$log', '$scope', '$state', 'Authentication', 'domainsQuota', 'rootDomain',
    'treeTitle', 'treeType'
  ];

  /**
   * @namespace DomainQuotaTreeController
   * @desc Application domain quota tree system controller
   * @memberOf linshareAdminApp
   */
  function DomainQuotaTreeController($log, $scope, $state, Authentication, domainsQuota, rootDomain,
    treeTitle, treeType) {

    $scope.domainsQuota = domainsQuota;
    $scope.hasGuestDomain = hasGuestDomain;
    $scope.isDomainQuotaInError = isDomainQuotaInError;
    $scope.isParent = isParent;
    $scope.root = [rootDomain];
    $scope.state = treeType;
    $scope.title = treeTitle;

    activate();

    ////////////

    /**
     * @name activate
     * @desc Activation function of the controller, launch at every instantiation
     * @memberOf linshareAdminApp.DomainQuotaTreeController
     */
    function activate() {
      Authentication.getCurrentUser().then(function(user) {
        $scope.adminDomain = user.domain;
      });
      $scope.domainsIdQuotaError = getDomainIdInError();
    }

    /**
     * @name getDomainIdInError
     * @desc Retrieve an array of Domain id with exceeded quota
     * @returns {Array<string>} Array of Domain id
     * @memberOf linshareAdminApp.DomainQuotaTreeController
     */
    function getDomainIdInError() {
      return _.map($scope.domainsQuota, function(domainQuota) {
        if (domainQuota.usedSpace >= domainQuota.quota) {
          return domainQuota.domain.identifier;
        } else {
          return undefined;
        }
      });
    }

    //TODO [TOFILL]
    function findDeep(domain, attrs) {
      var match = function(attrValue, attrs) {
        for (var key in attrs) {
          if (!_.isUndefined(attrValue)) {
            if (attrs[key] !== attrValue[key]) {
              return false;
            }
          }
        }
        return true;
      };
      var traverse = function(domain, attrs) {
        var result;
        _.forEach(domain, function(attr) {
          if (attr && match(attr, attrs)) {
            result = attr;
            return false;
          }
          if (_.isObject(attr) || _.isArray(attr)) {
            result = traverse(attr, attrs);
          }
          if (result) {
            return false;
          }
        });
        return result;
      }
      return traverse(domain, attrs);
    };

    /**
     * @name hasGuestDomain
     * @desc Determine if a domain posses a guest domain
     * @param {Object} topDomain - The Domain object to check against
     * @returns {Boolean}
     * @memberOf linshareAdminApp.DomainQuotaTreeController
     */
    function hasGuestDomain(topDomain) {
      return !_.isEmpty(
        _.find(topDomain.children, {
          'type': 'GUESTDOMAIN'
        })
      );
    };

    /**
     * @name isDomainQuotaInError
     * @desc Check if the domain identifier is in the list of domain which have quota error
     * @param {Object} domain - Domain object
     * @returns {boolean}
     * @memberOf linshareAdminApp.DomainQuotaTreeController
     */
    function isDomainQuotaInError(domain) {
      if (!_.isUndefined(domain) && !_.isUndefined($scope.domainsIdQuotaError)) {
        return _.include($scope.domainsIdQuotaError, domain.identifier);
      }
    }

    /**
     * @name isParent
     * @desc Determine if the domain contains children
     * @param {Object} domain - Domain object
     * @returns {boolean}
     * @memberOf linshareAdminApp.DomainQuotaTreeController
     */
    function isParent(domain) {
      return !_.isEmpty(findDeep(domain.children, {
        'identifier': $scope.adminDomain
      }));
    };
  }
})();
