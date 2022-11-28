import { RouteRecordRaw } from 'vue-router';
import QuotaPage from '@/modules/quota/pages/quota-page.vue';
export const QuotaConfigurationRoutes: RouteRecordRaw[] = [
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