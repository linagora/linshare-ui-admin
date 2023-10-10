import { RouteRecordRaw } from 'vue-router';

export const MY_SHARED_SPACES_ROUTE_NAMES = {
  SHARE_SPACES_LIST: 'SharedSpacesList',
  SHARE_SPACES_DETAIL: 'SharedSpaceDetails',
};
export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_LIST,
    path: 'administration/sharedspaces',
    component: () => import('../pages/manage-shared-spaces.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MY_SHARED_SPACES',
      requiresAuth: true,
    },
  },
  {
    name: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_DETAIL,
    path: 'administration/sharedspaces/:id',
    component: () => import('../components/shared-space-details.vue'),
    meta: {
      parentRoute: MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_LIST,
      label: 'NAVIGATOR.SHARED_SPACE_DETAILS',
      requiresAuth: true,
    },
  },
];
