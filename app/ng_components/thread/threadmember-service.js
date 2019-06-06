'use strict';

angular.module('linshareAdminApp')
  .factory('ThreadMember', ['_', '$log', 'Restangular', 'User',
      function (_, $log, Restangular, User) {
      var restUrl = 'shared_space_members';

      function mapServerDataToClientData(member) {
        return {
          uuid: member.uuid,
          nodeUuid: member.node.uuid,
          nodeName: member.node.name,
          nodeType: member.node.nodeType,
          nodeCreationDate: member.node.creationDate,
          nodeModificationDate: member.node.modificationDate,
          role: member.role,
          accountUuid: member.account.uuid,
          accountMail: member.account.mail,
          firstName: member.account.firstName,
          lastName: member.account.lastName,
          creationDate: member.creationDate,
          modificationDate: member.modificationDate
        };
      }

      function mapClientDataToServerData(member) {
        return {
          uuid: member.uuid,
          node: {
            uuid: member.nodeUuid,
            name: member.nodeName,
            nodeType: member.nodeType,
            creationDate: member.nodeCreationDate,
            modificationDate: member.nodeModificationDate
          },
          role: member.role,
          account: {
            uuid: member.accountUuid,
            name: member.firstName + ' ' + member.lastName,
            mail: member.accountMail,
            firstName: member.firstName,
            lastName: member.lastName
          },
          creationDate: member.creationDate,
          modificationDate: member.modificationDate
        };
      }

      return {
        getAll: function (thread) {
          $log.debug('ThreadMember:getAll');
          return Restangular
            .one('shared_spaces', thread.uuid)
            .all('members')
            .getList()
            .then(function (members) {
              return _.map(members, mapServerDataToClientData);
            });
        },
        add: function (thread, user) {
          $log.debug('ThreadMember:add');

          return User.createUser({
            uuid: user.uuid,
            creationDate: user.creationDate,
            modificationDate: user.modificationDate,
            domain: user.domain,
            firstName: user.firstName,
            lastName: user.lastName,
            mail: user.mail,
            accountType: user.accountType
          }).then(function (createdUser) {
            var threadMember = {
              node: {
                uuid: thread.uuid,
                name: thread.name,
                nodeType: thread.nodeType
              },
              role: user.role,
              account: {
                uuid: createdUser.uuid,
                name: createdUser.firstName + ' ' + createdUser.lastName,
                mail: createdUser.mail,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
              }
            };

            return Restangular.all(restUrl).post(threadMember);
          });
        },
        update: function (threadMember) {
          $log.debug('ThreadMember:update');
          return Restangular.all(restUrl).customPUT(mapClientDataToServerData(threadMember));
        },
        remove: function (threadMember) {
          $log.debug('ThreadMember:remove');

          return Restangular
            .all(restUrl)
            .one(threadMember.uuid)
            .customOperation(
              'remove',
              '',
              {},
              {},
              mapClientDataToServerData(threadMember)
            );
        },
        getRoles: getRoles
      };

      function getRoles() {
        $log.debug('ThreadMember:getRoles');
        return Restangular.all('shared_space_roles').getList();
      }
    }
  ]
  );
