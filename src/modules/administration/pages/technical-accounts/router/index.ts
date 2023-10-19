import { RouteRecordRaw } from 'vue-router';
import TechnicalAccountListEntries from '../pages/entries-page.vue';

export const MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES = {
  ENTRIES: 'TechnicalAccount',
  TECHNICAL_ACCOUNT_LIST: 'TechnicalAccountList',
};
export const technicalAccountRoutes: Array<RouteRecordRaw> = [
  {
    name: MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES.ENTRIES,
    path: 'technical-accounts',
    component: TechnicalAccountListEntries,
    meta: {
      parentRoute: 'Administration',
      label: 'NAVIGATOR.TECHNICAL_ACCOUNTS',
      requiresAuth: true,
    },
    children: [
      {
        name: MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES.TECHNICAL_ACCOUNT_LIST,
        path: '',
        component: () => import('../pages/technical-accounts.vue'),
        meta: {
          label: 'NAVIGATOR.TECHNICAL_ACCOUNTS',
          requiresAuth: true,
        },
      },
    ],
  },
];
