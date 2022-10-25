import { RouteRecordRaw } from 'vue-router';
import DesignSystemPage from '../pages/index-page.vue';

export const DesignSystemRoutes: RouteRecordRaw[] = [
  {
    name: 'DesignSystem',
    path: 'design-system',
    component: DesignSystemPage,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        name: 'DataEntryPage',
        path: 'data-entry',
        component: () => import('../pages/data-entry-page.vue'),
      },
      {
        name: 'FeedbackPage',
        path: 'feedback',
        component: () => import('../pages/feedback-page.vue'),
      },
      {
        name: 'FormPage',
        path: 'form',
        component: () => import('../pages/form-page.vue'),
      },
      {
        name: 'GeneralPage',
        path: 'general',
        component: () => import('../pages/general-page.vue'),
      },
      {
        name: 'NavigationPage',
        path: 'navigation',
        component: () => import('../pages/navigation-page.vue'),
      },
    ],
  },
];
