import { RouteRecordRaw } from 'vue-router';
import { requiresAuthGuard } from './requiresAuth.guard';

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/login/2fa',
    name: 'login2fa',
    component: () => import('../pages/LoginSecondFactor.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      if (!to.params.email || !to.params.password) {
        return next('/login');
      }
      next();
    }
  }
];

export { requiresAuthGuard };
