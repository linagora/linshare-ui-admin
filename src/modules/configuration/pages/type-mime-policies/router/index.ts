import { RouteRecordRaw } from 'vue-router';
import TypeMimePoliciesPage from '../pages/type-mime-policies-page.vue';

export const CONFIGURATION_MIME_POLICIES_ROUTE_NAMES = {
  ENTRIES: 'ConfigurationDomainTypeMimePolicies',
  DETAIL: 'ConfigurationDomainTypeMimePolicyDetail',
};

export const ConfigurationDomainTypeMimePoliciesRoutes: RouteRecordRaw[] = [
  {
    name: CONFIGURATION_MIME_POLICIES_ROUTE_NAMES.ENTRIES,
    path: ':domainUuid/type-mime-policies',
    component: TypeMimePoliciesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.TYPE_MIME',
    },
    children: [],
  },
  {
    name: CONFIGURATION_MIME_POLICIES_ROUTE_NAMES.DETAIL,
    path: ':domainUuid/type-mime-policies/:mimePolicyUuid',
    component: () => import('@/modules/configuration/pages/type-mime-policies/pages/mime-policy-detail-page.vue'),
    meta: {
      requiresAuth: true,
      parentRoute: CONFIGURATION_MIME_POLICIES_ROUTE_NAMES.ENTRIES,
      label: 'NAVIGATOR.TYPE_MIME_DETAILS',
    },
    children: [],
  },
];
