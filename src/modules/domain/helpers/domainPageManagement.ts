import { LocationAsRelativeRaw, RouteRecordName } from 'vue-router';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';

export interface DomainManagementPage {
  title: string;
  legacy?: boolean;
  route?: LocationAsRelativeRaw;
  child?: boolean;
  accessibility?: {
    domainTypes?: DOMAIN_TYPE[];
    userRoles?: ACCOUNT_ROLE[];
  };
}

const DOMAIN_MANAGEMENT_PAGES: DomainManagementPage[] = [
  {
    title: 'NAVIGATOR.DETAILS',
    route: { name: 'DomainDetails' }
  },
  {
    title: 'NAVIGATOR.REMOTE_SERVERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'RemoteServersList' }
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: { domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB] },
    route: { name: 'DomainProviders' }
  },
  {
    title: 'NAVIGATOR.PROVIDERS',
    accessibility: { domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB] },
    route: { name: 'DomainProviderManagement' },
    child: true
  },
  {
    title: 'NAVIGATOR.USER_PROVIDERS',
    accessibility: { domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB] },
    route: { name: 'DomainUserProviders' },
    child: true
  },
  {
    title: 'NAVIGATOR.GROUP_PROVIDERS',
    accessibility: { domainTypes: [DOMAIN_TYPE.TOP, DOMAIN_TYPE.SUB] },
    route: { name: 'DomainGroupProviders' },
    child: true
  },
  {
    title: 'NAVIGATOR.REMOTE_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'DomainRemoteFilters' }
  },
  {
    title: 'NAVIGATOR.USER_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'UserFilters' },
    child: true
  },
  {
    title: 'NAVIGATOR.LDAP_USER_FILTER',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'UserFilterLDAP' },
    child: true
  },
  {
    title: 'NAVIGATOR.GROUP_FILTERS',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'GroupFilters' },
    child: true
  },
  {
    title: 'NAVIGATOR.LDAP_GROUP_FILTER',
    accessibility: { userRoles: [ACCOUNT_ROLE.SUPERADMIN] },
    route: { name: 'GroupFilterLDAP' },
    child: true
  },
  {
    title: 'NAVIGATOR.PARAMETERS',
    legacy: true
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true
  },
  {
    title: 'NAVIGATOR.WELCOME_MESSAGES',
    legacy: true
  },
  {
    title: 'NAVIGATOR.TYPE_MIME',
    legacy: true
  },
  {
    title: 'NAVIGATOR.QUOTA',
    legacy: true
  },
  {
    title: 'NAVIGATOR.PUBLIC_KEYS'
  }
];

export const findDomainPage = (routeName: RouteRecordName): DomainManagementPage | undefined =>
  DOMAIN_MANAGEMENT_PAGES.find(page => !page.legacy && page.route?.name === routeName);

export const getMainPages = (): DomainManagementPage[] => DOMAIN_MANAGEMENT_PAGES.filter(page => !page.child);

export const canAccessPage = (page: DomainManagementPage, userRole: ACCOUNT_ROLE, domainType: DOMAIN_TYPE): boolean => {
  if (!page.accessibility) {
    return true;
  }

  if (page.accessibility.userRoles && !page.accessibility.userRoles.includes(userRole)) {
    return false;
  }

  return !page.accessibility.domainTypes || !!page.accessibility.domainTypes.includes(domainType);
};
