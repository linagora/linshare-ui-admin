import { RouteRecordName } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';

export interface ConfigurationPage {
  title: string;
  legacy?: boolean;
  sub?: boolean;
  route?: {
    name: string;
    requiresCurrentDomain?: boolean;
  };
  accessibility?: {
    domainTypes?: DOMAIN_TYPE[];
    userRoles?: ACCOUNT_ROLE[];
  };
}

const CONFIGURATION_PAGES: ConfigurationPage[] = [
  {
    title: 'NAVIGATOR.DETAILS',
    route: {
      name: 'DomainDetails',
      requiresCurrentDomain: true,
    },
  },
  {
    title: 'NAVIGATOR.REMOTE_SERVERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'RemoteServersList',
    },
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainProviders',
      requiresCurrentDomain: true,
    },
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainProviderManagement',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  {
    title: 'NAVIGATOR.USER_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB, DOMAIN_TYPE.GUEST],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainUserProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  {
    title: 'NAVIGATOR.GROUP_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainGroupProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  {
    title: 'NAVIGATOR.WORKSPACE_PROVIDERS',
    accessibility: {
      domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB],
      userRoles: [ACCOUNT_ROLE.SUPERADMIN],
    },
    route: {
      name: 'DomainWorkspaceProviders',
      requiresCurrentDomain: true,
    },
    sub: true,
  },
  {
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: {
      name: 'RemoteFiltersList',
    },
  },
  {
    title: 'NAVIGATOR.PARAMETERS',
    legacy: true,
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true,
  },
  {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    route: {
      name: 'WelcomeMessages',
      requiresCurrentDomain: true,
    },
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true,
  },
  {
    title: 'NAVIGATOR.QUOTA',
    legacy: true,
  },
  {
    title: 'NAVIGATOR.PUBLIC_KEYS',
  },
];

export const findDomainPage = (routeName: RouteRecordName): ConfigurationPage | undefined =>
  CONFIGURATION_PAGES.find((page) => !page.legacy && page.route?.name === routeName);

export const getMainPages = (): ConfigurationPage[] => CONFIGURATION_PAGES.filter((page) => !page.sub);

export const canAccessPage = (page: ConfigurationPage, userRole: ACCOUNT_ROLE, domainType?: DOMAIN_TYPE): boolean => {
  if (!page.accessibility) {
    return true;
  }

  if (page.accessibility.userRoles && !page.accessibility.userRoles.includes(userRole)) {
    return false;
  }

  if (!page.accessibility.domainTypes) {
    return true;
  }

  return !!domainType && !!page.accessibility.domainTypes.includes(domainType);
};
