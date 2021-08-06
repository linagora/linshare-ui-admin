import { RouteRecordRaw } from 'vue-router';
import { requiresAuthGuard } from './requiresAuth.guard';

export const LoginRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Login',
    path: '/login',
    props: true,
    component: () => import('../pages/Login.vue')
  },
  {
    name: 'LoginUsingSecondFactorAuthentication',
    path: '/login/2fa',
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

export const ManageSecondFactorAuthenticationRoute: RouteRecordRaw = {
  name: 'ManageSecondFactorAuthentication',
  path: '/second_factor_authentication',
  component: () => import('../pages/ManageSecondFactorAuthentication.vue'),
  meta: {
    requiresAuth: true
  }
};

export { requiresAuthGuard };
