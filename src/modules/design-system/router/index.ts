import { RouteRecordRaw } from 'vue-router';
import DesignSystemPage from '../pages/feedback-page.vue';

export const DesignSystemRoutes: RouteRecordRaw[] = [
  {
    name: 'DesignSystem',
    path: 'design-system',
    component: DesignSystemPage,
    meta: {
      requiresAuth: true,
    },
  },
];
