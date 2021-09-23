import {
  CloudOutlined,
  TeamOutlined,
  FolderOpenOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  MailOutlined,
  UpCircleOutlined
} from '@ant-design/icons-vue';
import { FunctionalComponent } from 'vue';
import { PERMISSIONS } from '@/core/constants';

export interface MenuItem {
  name: string;
  key: string;
  icon?: FunctionalComponent | string;
  permission?: string;
  path?: string;
  items?: MenuItem[];
}

export const menuTree: MenuItem[] = [
  {
    name: 'NAVIGATOR.DOMAINS',
    key: 'domain',
    icon: CloudOutlined,
    permission: 'DOMAINS.VIEW',
    items: [
      {
        name: 'NAVIGATOR.MANAGE_DOMAINS',
        key: 'manage-domains',
        permission: PERMISSIONS.DOMAINS.MANAGE_DOMAINS
      },
      {
        name: 'NAVIGATOR.FUNCTIONALITIES',
        key: 'functionalities',
        permission: PERMISSIONS.DOMAINS.FUNCTIONALITIES
      }
    ]
  },
  {
    name: 'NAVIGATOR.USERS',
    key: 'user',
    icon: TeamOutlined,
    permission: PERMISSIONS.USERS.VIEW,
    items: [
      {
        name: 'NAVIGATOR.MANAGE_USERS',
        key: 'manage-users',
        path: '/users/manage',
        permission: PERMISSIONS.USERS.MANAGE_USERS
      },
      {
        name: 'NAVIGATOR.INCONSISTENT_USERS',
        key: 'inconsistent-users',
        permission: PERMISSIONS.USERS.INCONSISTENT_USERS
      },
      {
        name: 'NAVIGATOR.TECHNICAL_ACCOUNTS',
        key: 'technical-accounts',
        permission: PERMISSIONS.USERS.TECHNICAL_ACCOUNTS
      }
    ]
  },
  {
    name: 'NAVIGATOR.WORKGROUPS',
    key: 'workgroups',
    icon: FolderOpenOutlined,
    permission: PERMISSIONS.WORKGROUPS.VIEW
  },
  {
    name: 'NAVIGATOR.MAILING_LISTS',
    key: 'mailing-lists',
    icon: UnorderedListOutlined,
    permission: PERMISSIONS.MAILING_LISTS.VIEW
  },
  {
    name: 'NAVIGATOR.HISTORY',
    key: 'history',
    icon: ClockCircleOutlined,
    permission: PERMISSIONS.HISTORY.VIEW
  },
  {
    name: 'NAVIGATOR.MAILS',
    key: 'mails',
    icon: MailOutlined,
    permission: PERMISSIONS.MAILS.VIEW,
    items: [
      {
        name: 'NAVIGATOR.MAIL_CONFIGURATION',
        key: 'mail-configuration',
        permission: PERMISSIONS.MAILS.CONFIGURATION
      },
      {
        name: 'NAVIGATOR.MAIL_LAYOUT',
        key: 'mail-layout',
        permission: PERMISSIONS.MAILS.LAYOUT
      },
      {
        name: 'NAVIGATOR.MAIL_FOOTER',
        key: 'mail-footer',
        permission: PERMISSIONS.MAILS.FOOTER
      },
      {
        name: 'NAVIGATOR.MAIL_CONTENT',
        key: 'mail-content',
        permission: PERMISSIONS.MAILS.CONTENT
      },
      {
        name: 'NAVIGATOR.MAIL_ACTIVATION',
        key: 'mail-activation',
        permission: PERMISSIONS.MAILS.ACTIVATION
      }
    ]
  },
  {
    name: 'NAVIGATOR.UPGRADE_TASKS',
    key: 'upgrade-tasks',
    icon: UpCircleOutlined,
    permission: PERMISSIONS.UPGRADE_TASKS.VIEW
  }
];

export const buildPermissions = (role: string) => {
  switch (role) {
    case 'SUPERADMIN':
      return [
        PERMISSIONS.DOMAINS.VIEW,
        PERMISSIONS.DOMAINS.MANAGE_DOMAINS,
        PERMISSIONS.DOMAINS.FUNCTIONALITIES,
        PERMISSIONS.USERS.VIEW,
        PERMISSIONS.USERS.MANAGE_USERS,
        PERMISSIONS.USERS.INCONSISTENT_USERS,
        PERMISSIONS.USERS.TECHNICAL_ACCOUNTS,
        PERMISSIONS.WORKGROUPS.VIEW,
        PERMISSIONS.MAILING_LISTS.VIEW,
        PERMISSIONS.HISTORY.VIEW,
        PERMISSIONS.MAILS.VIEW,
        PERMISSIONS.MAILS.CONFIGURATION,
        PERMISSIONS.MAILS.LAYOUT,
        PERMISSIONS.MAILS.FOOTER,
        PERMISSIONS.MAILS.CONTENT,
        PERMISSIONS.MAILS.ACTIVATION,
        PERMISSIONS.UPGRADE_TASKS.VIEW
      ];
    case 'ADMIN':
      return [
        PERMISSIONS.DOMAINS.VIEW,
        PERMISSIONS.DOMAINS.MANAGE_DOMAINS,
        PERMISSIONS.DOMAINS.FUNCTIONALITIES,
        PERMISSIONS.USERS.VIEW,
        PERMISSIONS.USERS.MANAGE_USERS,
        PERMISSIONS.USERS.INCONSISTENT_USERS,
        PERMISSIONS.USERS.TECHNICAL_ACCOUNTS,
        PERMISSIONS.WORKGROUPS.VIEW,
        PERMISSIONS.MAILING_LISTS.VIEW,
        PERMISSIONS.HISTORY.VIEW,
        PERMISSIONS.MAILS.VIEW,
        PERMISSIONS.MAILS.CONFIGURATION,
        PERMISSIONS.MAILS.LAYOUT,
        PERMISSIONS.MAILS.FOOTER,
        PERMISSIONS.MAILS.CONTENT,
        PERMISSIONS.MAILS.ACTIVATION,
        PERMISSIONS.UPGRADE_TASKS.VIEW
      ];
    default:
      return [];
  }
};

export const havePermission = (role: string, permission?: string) => {
  if (!permission) return true;

  return buildPermissions(role).includes(permission);
};