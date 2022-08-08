import { RouteRecordRaw } from 'vue-router';

export const ReportingRoute: RouteRecordRaw = {
  name: 'Reporting',
  path: 'reporting',
  component: () => import('../components/ReportingPage.vue'),
  meta: {
    requiresAuth: true,
  },
};
