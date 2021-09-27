import { RouteRecordRaw } from 'vue-router';

export const UserFilterRoute: RouteRecordRaw = {
  name: 'UserFilters',
  path: 'filters/user',
  component: () => import('../components/UserFiltersList.vue'),
  meta: {
    parentRoute: 'DomainRemoteFilters',
    label: 'NAVIGATOR.USER_FILTERS',
    requiresAuth: true
  }
};
