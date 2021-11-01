import { RouteRecordRaw } from 'vue-router';

export const DriveFilterRoutes: RouteRecordRaw[] = [
  {
    name: 'DriveFilters',
    path: 'filters/drive',
    component: () => import('../components/DriveFiltersList.vue'),
    meta: {
      parentRoute: 'DomainRemoteFilters',
      label: 'NAVIGATOR.DRIVE_FILTERS',
      requiresAuth: true
    }
  },
  {
    name: 'DriveFilterLDAP',
    path: 'filters/drive/ldap',
    component: () => import('../components/DriveFilterLDAP.vue'),
    props: route => ({ ...route.params }),
    meta: {
      parentRoute: 'DriveFilters',
      label: 'NAVIGATOR.LDAP_DRIVE_FILTER',
      requiresAuth: true
    }
  }
];
