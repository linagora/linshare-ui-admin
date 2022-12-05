import { RouteRecordRaw } from 'vue-router';
import QuotaPage from '../pages/quota-page.vue';
export const ConfigurationDomainQuotaRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainQuota',
    path: ':domainUuid/quota',
    component: QuotaPage,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },
];
