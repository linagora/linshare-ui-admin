import { RouteRecordRaw } from 'vue-router';

export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    name: 'SharedSpacesList',
    path: 'administration/sharedspaces',
    component: () => import('../pages/manage-shared-spaces.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MY_SHARED_SPACES',
      requiresAuth: true,
    },
  },
  {
    name: 'SharedSpaceDetails',
    path: 'administration/sharedspaces/:id',
    component: () => import('../components/shared-space-details.vue'),
    meta: {
      parentRoute: 'SharedSpacesList',
      label: 'NAVIGATOR.SHARED_SPACE_DETAILS',
      requiresAuth: true,
    },
  },
];
