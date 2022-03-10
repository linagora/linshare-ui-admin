import { RouteRecordRaw } from 'vue-router';

export const GroupFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'GroupFilters',
    path: 'filters/group',
    component: () => import('../components/GroupFiltersList.vue'),
    meta: {
      parentRoute: 'DomainRemoteFilters',
      label: 'NAVIGATOR.GROUP_FILTERS',
      requiresAuth: true,
    },
  },
  {
    name: 'GroupFilterLDAP',
    path: 'filters/group/ldap',
    component: () => import('../components/GroupFilterLDAP.vue'),
    props: (route) => ({ ...route.params }),
    meta: {
      parentRoute: 'GroupFilters',
      label: 'NAVIGATOR.LDAP_GROUP_FILTER',
      requiresAuth: true,
    },
  },
];
