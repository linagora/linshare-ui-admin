import { RouteRecordRaw } from 'vue-router';
import AdministrationLayout from '@/core/layout/AdministrationLayout.vue';
import { PERMISSIONS } from '@/core/constants';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    path: '/users',
    name: 'UsersList',
    component: () => import('../pages/ManageUsers.vue'),
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout,
      permission: PERMISSIONS.USERS.VIEW,
      parent: 'Administration',
      parentName: 'NAVIGATOR.ADMINISTRATION'
    }
  },
  {
    path: '/users/:id',
    component: () => import('../pages/UserDetail.vue'),
    name: 'UserDetail',
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout,
      permission: PERMISSIONS.USERS.MANAGE_USERS,
      parent: 'UsersList',
      parentName: 'NAVIGATOR.MANAGE_USERS'
    }
  }
];
