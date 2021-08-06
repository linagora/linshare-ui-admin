import { RouteRecordRaw } from 'vue-router';

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    name: 'UsersList',
    path: 'administration/users',
    component: () => import('../pages/ManageUsers.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MANAGE_USERS',
      requiresAuth: true
    }
  },
  {
    name: 'UserDetail',
    path: 'administration/users/:id',
    component: () => import('../pages/UserDetail.vue'),
    meta: {
      parentRoute: 'UsersList',
      label: 'NAVIGATOR.USER_DETAILS',
      requiresAuth: true
    }
  }
];
