import { RouteRecordRaw } from 'vue-router';

export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    name: 'SharedSpacesList',
    path: 'administration/sharedspaces',
    component: () => import('../pages/ManageSharedSpaces.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MY_SHARED_SPACES',
      requiresAuth: true
    }
  }
];
