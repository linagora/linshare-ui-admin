import { RouteRecordRaw } from 'vue-router';
import AdministrationLayout from '@/core/layout/AdministrationLayout.vue';
import { PERMISSIONS } from '@/core/constants';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    path: '/users',
    redirect: '/users/manage',
    name: 'Users',
    component: () => import('../pages/ManageUsers.vue'),
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout,
      permission: PERMISSIONS.USERS.VIEW,
      parent: 'administration',
      parentName: 'NAVIGATOR.ADMINISTRATION'
    },
    children: [
      {
        path: '/users/manage',
        component: () => import('../pages/ManageUsers.vue'),
        name: 'ManageUsers',
        meta: {
          requiresAuth: true,
          layout: AdministrationLayout,
          permission: PERMISSIONS.USERS.MANAGE_USERS,
          parent: 'administration',
          parentName: 'NAVIGATOR.ADMINISTRATION'
        }
      }
    ]
  },
  {
    path: '/users/:id',
    component: () => import('../pages/UserDetail.vue'),
    name: 'UserDetail',
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout,
      permission: PERMISSIONS.USERS.MANAGE_USERS,
      parent: 'administration',
      parentName: 'NAVIGATOR.ADMINISTRATION'
    }
  }
];
