import { RouteRecordRaw } from 'vue-router';
import { PERMISSIONS } from '@/core/constants';
import AdministrationLayout from '@/core/layout/AdministrationLayout.vue';

export const SharedSpacesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sharedspaces',
    name: 'SharedSpaces',
    component: () => import('../pages/ManageSharedSpaces.vue'),
    meta: {
      requiresAuth: true,
      parent: 'administration',
      parentName: 'NAVIGATOR.ADMINISTRATION',
      layout: AdministrationLayout,
      permission: PERMISSIONS.WORKGROUPS.VIEW
    }
  }
];
