import { RouteRecordRaw } from 'vue-router';

export const MY_TECHNICAL_USERS_ROUTE_NAMES = {
  TECHNICAL_USER_LIST: 'TechnicalUsersList',
};
export const technicalUserRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_TECHNICAL_USERS_ROUTE_NAMES.TECHNICAL_USER_LIST,
    path: 'administration/technical-accounts',
    component: () => import('../pages/technical-accounts.vue'),
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.TECHNICAL_ACCOUNTS',
      requiresAuth: true,
    },
  },
];
