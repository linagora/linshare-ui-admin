import { RouteRecordRaw } from 'vue-router';
import TypeMimePoliciesPage from '../pages/type-mime-policies-page.vue';
export const ConfigurationDomainTypeMimePoliciesRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainTypeMimePolicies',
    path: ':domainUuid/type-mime-policies',
    component: TypeMimePoliciesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.TYPE_MIME',
    },
    children: [],
  },
];
