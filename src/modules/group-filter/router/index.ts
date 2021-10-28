import { RouteRecordRaw } from 'vue-router';

export const GroupFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'GroupFilters',
    path: 'filters/group',
    component: () => import('../components/GroupFiltersList.vue'),
    meta: {
      parentRoute: 'DomainRemoteFilters',
      label: 'NAVIGATOR.GROUP_FILTERS',
      requiresAuth: true
    }
  }
];
