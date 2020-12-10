import { RouteRecordRaw } from 'vue-router';
import AdminLayout from '@/core/layout/AdminLayout.vue';
export const DashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      layout: AdminLayout
    }
  }
];
