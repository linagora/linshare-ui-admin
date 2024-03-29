import { RouteRecordRaw } from 'vue-router';
import DomainPoliciesPage from '@/modules/configuration/pages/domain-policies/pages/policies-page.vue';
export const CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES = {
  POLICIES: 'ConfigurationDomainPolicies',
  POLICY_DETAIL: 'ConfigurationDomainPoliciesDetail',
};

export const ConfigurationDomainPoliciesRoutes: RouteRecordRaw[] = [
  {
    name: CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES.POLICIES,
    path: ':domainUuid/domain-policies',
    component: DomainPoliciesPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.CONFIGURATION_DOMAIN_POLICIES',
    },
    children: [],
  },
  {
    name: CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES.POLICY_DETAIL,
    path: ':domainUuid/domain-policies/:id',
    component: () => import('@/modules/configuration/pages/domain-policies/pages/policy-detail-page.vue'),
    meta: {
      requiresAuth: true,
      parentRoute: CONFIGURATION_DOMAIN_POLICIES_ROUTE_NAMES.POLICIES,
      label: 'NAVIGATOR.CONFIGURATION_DOMAIN_POLICIES_DETAILS',
    },
    children: [],
  },
];
