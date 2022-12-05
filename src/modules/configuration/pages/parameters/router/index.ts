import { RouteRecordRaw } from 'vue-router';
import ParametersPage from '../pages/parameters-page.vue';
export const ConfigurationDomainParametersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainParameters',
    path: ':domainUuid/parameters',
    component: ParametersPage,
    meta: {
      requiresAuth: true,
    },
    children: [],
  },
];
