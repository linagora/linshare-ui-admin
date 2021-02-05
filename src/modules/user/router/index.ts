import { RouteRecordRaw } from 'vue-router';
import AdminLayout from '@/core/layout/AdminLayout.vue';
import { PERMISSIONS } from '@/core/constants';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    path: '/users',
    redirect: '/users/manage',
    name: 'Users',
    component: () => import('../pages/ManageUsers.vue'),
    meta: {
      requiresAuth: true,
      layout: AdminLayout,
      permission: PERMISSIONS.USERS.VIEW
    },
    children: [
      {
        path: '/users/manage',
        component: () => import('../pages/ManageUsers.vue'),
        name: 'ManageUsers',
        meta: {
          requiresAuth: true,
          layout: AdminLayout,
          permission: PERMISSIONS.USERS.MANAGE_USERS
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
      layout: AdminLayout,
      permission: PERMISSIONS.USERS.MANAGE_USERS
    }
  }
];
