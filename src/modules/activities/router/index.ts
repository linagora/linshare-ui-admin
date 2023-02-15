import { RouteRecordRaw } from 'vue-router';

export const ActivitiesRoute: RouteRecordRaw = {
  name: 'Activities',
  path: 'activities',
  component: () => import('../layouts/activities-layout.vue'),
  meta: {
    label: 'NAVIGATOR.ACTIVITIES',
    requiresAuth: true,
    uiBeta: true,
  },
  children: [
    {
      name: 'ActivitiesEntries',
      path: '',
      component: () => import('../pages/index-page.vue'),
    }
  ],
};
