import { RouteRecordRaw } from 'vue-router';
import { requiresAuthGuard } from './requiresAuth.guard';
import AdministrationLayout from '@/core/layout/AdministrationLayout.vue';

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    props: true,
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
  },
  {
    path: '/second_factor_authentication',
    name: 'ManageSecondFactorAuthentication',
    component: () => import('../pages/ManageSecondFactorAuthentication.vue'),
    meta: {
      requiresAuth: true,
      layout: AdministrationLayout
    }
  }
];

export { requiresAuthGuard };
