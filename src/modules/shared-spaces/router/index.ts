import { RouteRecordRaw } from 'vue-router';

export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    name: 'SharedSpacesList',
    path: 'administration/sharedspaces',
    component: () => import('../pages/ManageSharedSpaces.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MY_DRIVES_WORKGROUPS',
      requiresAuth: true
    }
  }
];
