import { RouteRecordRaw } from 'vue-router';
import TypeMinePoliciesPage from '../pages/type-mime-policies-page.vue';
export const ConfigurationDomainTypeMinePoliciesRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainTypeMinePolicies',
    path: ':domainUuid/type-mime-policies',
    component: TypeMinePoliciesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.TYPE_MIME',
    },
    children: [],
  },
];
