import { RouteRecordRaw } from 'vue-router';
import DetailPage from '../pages/detail-page.vue';
export const ConfigurationDomainDetailRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainDetail',
    path: ':domainUuid/detail',
    component: DetailPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.DETAILS',
    },
    children: [],
  },
];
