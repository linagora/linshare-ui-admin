import { RouteRecordRaw } from 'vue-router';

export const ReportingRoute: RouteRecordRaw = {
  name: 'Reporting',
  path: 'reporting',
  component: () => import('../components/reporting-page.vue'),
  meta: {
    requiresAuth: true,
    uiBeta: true,
  },
};
