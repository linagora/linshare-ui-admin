import { RouteRecordRaw } from 'vue-router';
import AdminLayout from '@/core/layout/AdminLayout.vue';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    path: '/users',
    redirect: '/users/manage',
    name: 'Users',
    component: () => import('../pages/ManageUsers.vue'),
    meta: {
      requiresAuth: true,
      layout: AdminLayout
    },
    children: [
      {
        path: '/users/manage',
        component: () => import('../pages/ManageUsers.vue'),
        name: 'ManageUsers',
        meta: {
          requiresAuth: true,
          layout: AdminLayout
        }
      }
    ]
  }
];
