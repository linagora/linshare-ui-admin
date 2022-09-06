import { RouteRecordRaw } from 'vue-router';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    name: 'UsersList',
    path: 'administration/users',
    component: () => import('../pages/manage-users.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MANAGE_USERS',
      requiresAuth: true,
    },
  },
  {
    name: 'UserDetail',
    path: 'administration/users/:id',
    component: () => import('../pages/user-detail.vue'),
    meta: {
      parentRoute: 'UsersList',
      label: 'NAVIGATOR.USER_DETAILS',
      requiresAuth: true,
    },
  },
];
