import { RouteRecordRaw } from 'vue-router';
import TypeMinePoliciesPage from '../pages/type-mine-policies-page.vue';
export const ConfigurationDomainTypeMinePoliciesRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainTypeMinePolicies',
    path: ':domainUuid/type-mine-policies',
    component: TypeMinePoliciesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.TYPE_MIME',
    },
    children: [],
  },
];
