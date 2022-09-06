import { RouteRecordRaw } from 'vue-router';

export const RemoteFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'RemoteFiltersList',
    path: 'filters',
    component: () => import('../components/remote-filters.vue'),
    meta: {
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.REMOTE_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'UserFilters',
    path: 'filters/user',
    component: () => import('../components/user-filters-list.vue'),
    meta: {
      parentRoute: 'RemoteFiltersList',
      label: 'NAVIGATOR.USER_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'UserFilterLDAP',
    path: 'filters/user/ldap',
    component: () => import('../components/user-filter-ldap.vue'),
    props: (route) => ({ ...route.params }),
    meta: {
      parentRoute: 'UserFilters',
      label: 'NAVIGATOR.LDAP_USER_FILTER',
      requiresAuth: true,
    },
  },
  {
    name: 'GroupFilters',
    path: 'filters/group',
    component: () => import('../components/group-filters-list.vue'),
    meta: {
      parentRoute: 'RemoteFiltersList',
      label: 'NAVIGATOR.GROUP_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'GroupFilterLDAP',
    path: 'filters/group/ldap',
    component: () => import('../components/group-filter-ldap.vue'),
    props: (route) => ({ ...route.params }),
    meta: {
      parentRoute: 'GroupFilters',
      label: 'NAVIGATOR.LDAP_GROUP_FILTER',
      requiresAuth: true,
    },
  },
  {
    name: 'WorkspaceFilters',
    path: 'filters/workspace',
    component: () => import('../components/workspace-filters-list.vue'),
    meta: {
      parentRoute: 'RemoteFiltersList',
      label: 'NAVIGATOR.WORKSPACE_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'WorkspaceFilterLDAP',
    path: 'filters/workspace/ldap',
    component: () => import('../components/workspace-filter-ldap.vue'),
    props: (route) => ({ ...route.params }),
    meta: {
      parentRoute: 'WorkspaceFilters',
      label: 'NAVIGATOR.LDAP_WORKSPACE_FILTER',
      requiresAuth: true,
    },
  },
];
