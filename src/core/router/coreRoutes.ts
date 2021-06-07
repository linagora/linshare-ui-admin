import { RouteRecordRaw } from 'vue-router';
import ConfigurationLayout from '@/core/layout/ConfigurationLayout.vue';
import AdministrationLayout from '@/core/layout/AdministrationLayout.vue';

export const CoreRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'configuration',
    component: () => import('../pages/Configuration.vue'),
    meta: {
      requiresAuth: true,
      layout: ConfigurationLayout
    }
  },
  {
    path: '/administration',
    name: 'administration',
    component: () => import('../pages/Administration.vue'),
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout
    }
  }
];
