import { RouteRecordRaw } from 'vue-router';
import { requiresAuthGuard } from './requiresAuth.guard';

export const LoginRoutes: Array<RouteRecordRaw> = [{
  path: '/login',
  name: 'login',
  component: () => import('../pages/Login.vue')
}];

export { requiresAuthGuard };
