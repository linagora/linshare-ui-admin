import { RouteRecordRaw } from 'vue-router';
import { checkAccessiblePage } from '@/modules/domain/router/checkAccessiblePage';

export const UserFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'UserFilters',
    path: 'filters/user',
    component: () => import('../components/UserFiltersList.vue'),
    beforeEnter: checkAccessiblePage,
    meta: {
      parentRoute: 'DomainRemoteFilters',
      label: 'NAVIGATOR.USER_FILTERS',
      requiresAuth: true
    }
  },
  {
    name: 'UserFilterLDAP',
    path: 'filters/user/ldap',
    component: () => import('../components/UserFilterLDAP.vue'),
    props: route => ({ ...route.params }),
    beforeEnter: checkAccessiblePage,
    meta: {
      parentRoute: 'UserFilters',
      label: 'NAVIGATOR.LDAP_USER_FILTER',
      requiresAuth: true
    }
  }
];
