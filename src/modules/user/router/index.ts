import { RouteRecordRaw } from 'vue-router';
import UserListsEntries from '@/modules/user/pages/entries-page.vue';

export const MY_USERS_ROUTE_NAMES = {
  ENTRIES: 'AdministrationUserListsEntries',
  USER_LIST: 'UsersList',
  USER_DETAIL: 'UserDetail',
};
export const UserRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_USERS_ROUTE_NAMES.ENTRIES,
    path: 'users',
    component: UserListsEntries,
    meta: {
      requiresAuth: true,
      parentRoute: 'AdministrationEntries',
      label: 'NAVIGATOR.ADMINISTRATION_CONTACT_LIST',
    },
    children: [
      {
        name: MY_USERS_ROUTE_NAMES.USER_LIST,
        path: '',
        component: () => import('../pages/manage-users.vue'),
        meta: {
          parentRoute: 'AdministrationEntries',
          label: 'NAVIGATOR.MANAGE_USERS',
          requiresAuth: true,
        },
      },
      {
        name: MY_USERS_ROUTE_NAMES.USER_DETAIL,
        path: ':id',
        component: () => import('../pages/user-detail.vue'),
        meta: {
          parentRoute: 'UsersList',
          label: 'NAVIGATOR.USER_DETAILS',
          requiresAuth: true,
        },
      },
    ],
  },
];
