import { RouteRecordRaw } from 'vue-router';
import ProvidersPage from '../pages/providers-page.vue';
export const ConfigurationDomainProvidersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainProviders',
    path: ':domainUuid/providers',
    component: ProvidersPage,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },
];
