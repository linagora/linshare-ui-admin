import { RouteRecordRaw } from 'vue-router';

export const MY_USERS_ROUTE_NAMES = {
  USER_LIST: 'UsersList',
  USER_DETAIL: 'UserDetail',
};
export const UserRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_USERS_ROUTE_NAMES.USER_LIST,
    path: 'administration/users',
    component: () => import('../pages/manage-users.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.MANAGE_USERS',
      requiresAuth: true,
    },
  },
  {
    name: MY_USERS_ROUTE_NAMES.USER_DETAIL,
    path: 'administration/users/:id',
    component: () => import('../pages/user-detail.vue'),
    meta: {
      parentRoute: 'UsersList',
      label: 'NAVIGATOR.USER_DETAILS',
      requiresAuth: true,
    },
  },
];
