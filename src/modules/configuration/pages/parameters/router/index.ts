import { RouteRecordRaw } from 'vue-router';
import ParametersPage from '../pages/parameters-page.vue';
import ParametersDetailsPage from '../components/domain-functionality-details.vue';
export const ConfigurationDomainParametersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainParameters',
    path: ':domainUuid/parameters',
    component: ParametersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.FUNCTIONALITIES',
    },
    children: [],
  },
  {
    name: 'DomainFunctionality',
    path: ':domainUuid/parameters/:identifier',
    component: ParametersDetailsPage,
    meta: {
      parentRoute: 'ConfigurationDomainParameters',
      requiresAuth: true,
    },
    children: [],
  },
];
