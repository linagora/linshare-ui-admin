'use strict';

angular.module('linshareAdminApp')
  .controller('DomainTreeCtrl',
  ['_', '$scope', '$log', '$state', 'treeType', 'treeTitle', 'rootDomain', 'Authentication',
    function(_, $scope, $log, $state, treeType, treeTitle, rootDomain, Authentication) {
      $scope.root = [rootDomain];
      $scope.state = treeType;
      $scope.title = treeTitle;
      Authentication.getCurrentUser().then(function(user) {
        $scope.adminDomain = user.domain;
      });
      var findDeep = function(domain, attrs) {

        var match = function(attrValue, attrs) {
          _.forEach(attrs, function(value, key) {
            if(!_.isUndefined(attrValue)) {
              if (attrs[key] !== attrValue[key]) {
                return false;
              }
            }
          });
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
        };

        return traverse(domain, attrs);

      };
      $scope.isParent = function(domain) {
        return !_.isEmpty(findDeep(domain.children, {'identifier': $scope.adminDomain}));
      };
      $scope.hasGuestDomain = function(topDomain) {
        return !_.isEmpty(
          _.find(topDomain.children, {'type': 'GUESTDOMAIN'})
        );
      };
      $scope.canAddChildDomain = function(domain) {
        return $scope.state === 'edit' &&
          (domain.type === 'TOPDOMAIN' || domain.type === 'ROOTDOMAIN');
      };
      $scope.canAddTopDomain = function(domain) {
        return domain.type === 'ROOTDOMAIN';
      };
      $scope.canAddSubDomain = function(domain) {
        return domain.type === 'TOPDOMAIN';
      };
      $scope.canAddGuestDomain = function(domain) {
        return (domain.type === 'TOPDOMAIN' &&
          _.isEmpty(
            _.find(domain.children, {'type': 'GUESTDOMAIN'})
          )
        );
      };
    }]
);
