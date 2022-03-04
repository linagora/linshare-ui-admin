import { RouteRecordRaw } from 'vue-router';

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
    beforeEnter: to => {
      if (!to.params.email || !to.params.password) {
        return '/login';
      }
    }
  },
  {
    name: 'OIDCCallback',
    path: '/oidccallback',
    component: () => import('../components/OIDCCallback.vue')
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
