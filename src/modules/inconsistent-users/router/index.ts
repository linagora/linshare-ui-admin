import { RouteRecordRaw } from 'vue-router';

export const INCONSISTENT_USERS_ROUTE_NAMES = {
  ENTRIES: 'InconsistentUsers',
  DIAGNOSIC: 'InconsistentUsersDiagnostic',
  INCONSISTENT_LIST: 'InconsistentUserList',
};

export const InconsistentUsersRoutes: Array<RouteRecordRaw> = [
  {
    name: INCONSISTENT_USERS_ROUTE_NAMES.ENTRIES,
    path: 'administration/InconsistentUsers',
    component: () => import('../pages/inconsistent-users-entries-page.vue'),
    meta: {
      parentRoute: INCONSISTENT_USERS_ROUTE_NAMES.ENTRIES,
      label: 'INCONSISTENT_USERS_ROUTE_NAMES.ENTRIES',
      requiresAuth: true,
    },
    children: [
      {
        name: INCONSISTENT_USERS_ROUTE_NAMES.DIAGNOSIC,
        path: 'diagnostic',
        component: () => import('../pages/manage-diagnostic-users.vue'),
        meta: {
          parentRoute: INCONSISTENT_USERS_ROUTE_NAMES.ENTRIES,
          label: 'INCONSISTENT_USERS_ROUTE_NAMES.DIAGNOSIC',
          requiresAuth: true,
        },
      },
      {
        name: INCONSISTENT_USERS_ROUTE_NAMES.INCONSISTENT_LIST,
        path: 'inconsistent',
        component: () => import('../pages/manage-inconsistent-users.vue'),
        meta: {
          parentRoute: INCONSISTENT_USERS_ROUTE_NAMES.ENTRIES,
          label: 'INCONSISTENT_USERS_ROUTE_NAMES.INCONSISTENT',
          requiresAuth: true,
        },
      },
    ],
  },
];
