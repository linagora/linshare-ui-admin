import { RouteRecordRaw } from 'vue-router';
import SharedSpacesListEntries from '@/modules/shared-spaces/pages/entries-page.vue';

export const MY_SHARED_SPACES_ROUTE_NAMES = {
  ENTRIES: 'AdministrationSharedSpacesListEntries',
  SHARE_SPACES_LIST: 'AdministrationSharedSpacesList',
  SHARE_SPACES_DETAIL: 'AdministrationSharedSpaceDetails',
};
export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_SHARED_SPACES_ROUTE_NAMES.ENTRIES,
    path: 'sharedspaces',
    component: SharedSpacesListEntries,
    meta: {
      requiresAuth: true,
      parentRoute: 'AdministrationEntries',
      label: 'NAVIGATOR.ADMINISTRATION_CONTACT_LIST',
    },
    children: [
      {
        name: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_LIST,
        path: '',
        component: () => import('../pages/manage-shared-spaces.vue'),
        meta: {
          label: 'NAVIGATOR.MY_SHARED_SPACES',
          parentRoute: 'AdministrationEntries',
          requiresAuth: true,
        },
      },
      {
        name: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_DETAIL,
        path: ':id',
        component: () => import('../components/shared-space-details.vue'),
        meta: {
          label: 'NAVIGATOR.SHARED_SPACE_DETAILS',
          parentRoute: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_LIST,
          requiresAuth: true,
        },
      },
    ],
  },
];
