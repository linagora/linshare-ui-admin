import { RouteRecordRaw } from 'vue-router';
import ProviderManagementPage from '../pages/domain-provider-management-page.vue';
export const ConfigurationDomainProviderManagementRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainProviderManagement',
    path: ':domainUuid/domain-provider-management',
    component: ProviderManagementPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
    },
    children: [],
  },
];
