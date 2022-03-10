import { RouteRecordRaw } from 'vue-router';

export const WorkspaceFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'WorkspaceFilters',
    path: 'filters/workspace',
    component: () => import('../components/WorkspaceFiltersList.vue'),
    meta: {
      parentRoute: 'DomainRemoteFilters',
      label: 'NAVIGATOR.WORKSPACE_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'WorkspaceFilterLDAP',
    path: 'filters/workspace/ldap',
    component: () => import('../components/WorkspaceFilterLDAP.vue'),
    props: (route) => ({ ...route.params }),
    meta: {
      parentRoute: 'WorkspaceFilters',
      label: 'NAVIGATOR.LDAP_WORKSPACE_FILTER',
      requiresAuth: true,
    },
  },
];
