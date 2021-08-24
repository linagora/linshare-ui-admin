import { RouteRecordRaw } from 'vue-router';

export const DomainRoutes: Array<RouteRecordRaw> = [
  {
    name: 'DomainDetails',
    path: 'details',
    component: () => import('../components/DomainDetails.vue'),
    meta: {
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.DOMAIN_DETAILS',
      requiresAuth: true
    }
  }
];
