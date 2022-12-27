import { RouteRecordRaw } from 'vue-router';
import RemoteFilterPage from '../pages/remote-filters-page.vue';
export const ConfigurationDomainRemoteFiltersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainRemoteFilters',
    path: ':domainUuid/remote-filters',
    component: RemoteFilterPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.REMOTE_FILTERS',
    },
    children: [],
  },
  {
    name: 'UserFilters',
    path: ':domainUuid/remote-filters/filters/user',
    component: () => import('../components/user-filters-list.vue'),
    meta: {
      label: 'NAVIGATOR.USER_FILTERS',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'UserFilterLDAP',
    path: ':domainUuid/remote-filters/filters/user/ldap/:filterUuid',
    component: () => import('../components/user-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_USER_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'DuplicateUserFilterLDAP',
    path: ':domainUuid/remote-filters/filters/user/ldap/:filterUuid/:duplicate',
    component: () => import('../components/user-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_USER_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'NewUserFilterLDAP',
    path: ':domainUuid/remote-filters/filters/user/ldap/:duplicate',
    component: () => import('../components/user-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_USER_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'GroupFilters',
    path: ':domainUuid/remote-filters/filters/group',
    component: () => import('../components/group-filters-list.vue'),
    meta: {
      label: 'NAVIGATOR.GROUP_FILTERS',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'GroupFilterLDAP',
    path: ':domainUuid/remote-filters/filters/group/ldap/:filterUuid',
    component: () => import('../components/group-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_GROUP_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'DuplicateGroupFilterLDAP',
    path: ':domainUuid/remote-filters/filters/group/ldap/:filterUuid/:duplicate',
    component: () => import('../components/group-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_GROUP_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'NewGroupFilterLDAP',
    path: ':domainUuid/remote-filters/filters/group/ldap/:duplicate',
    component: () => import('../components/group-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_GROUP_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'WorkspaceFilters',
    path: ':domainUuid/remote-filters/filters/workspace',
    component: () => import('../components/workspace-filters-list.vue'),
    meta: {
      label: 'NAVIGATOR.WORKSPACE_FILTERS',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'WorkspaceFilterLDAP',
    path: ':domainUuid/remote-filters/filters/workspace/ldap/:filterUuid',
    component: () => import('../components/workspace-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_WORKSPACE_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'DuplicateWorkspaceFilterLDAP',
    path: ':domainUuid/remote-filters/filters/workspace/ldap/:filterUuid/:duplicate',
    component: () => import('../components/workspace-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_WORKSPACE_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
  {
    name: 'NewWorkspaceFilterLDAP',
    path: ':domainUuid/remote-filters/filters/group/ldap/:duplicate',
    component: () => import('../components/workspace-filter-ldap.vue'),
    meta: {
      label: 'NAVIGATOR.LDAP_WORKSPACE_FILTER',
      requiresAuth: true,
      parentRoute: 'ConfigurationDomainRemoteFilters',
    },
  },
];
